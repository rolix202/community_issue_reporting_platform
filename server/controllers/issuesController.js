import { validationResult } from "express-validator";
import fileUpload from "../middlewares/imageMiddleware.js";
import { validate_issues } from "../middlewares/validationMiddleware.js";

import Issues from "../models/issuesModel.js";
import imageService from "../utils/imageService.js";

export const create_issues = [
    fileUpload('photo_upload'),
    ...validate_issues,
    async (req, res) => {
        const errors = validationResult(req);
        const errorsArray = errors.array();

        if (req.fileValidationError) {
            errorsArray.push({ msg: req.fileValidationError });
        }
        if (!req.files && !req.fileValidationError) {
            errorsArray.push({ msg: "Please upload an image file." });
        }
        if (errorsArray.length > 0) {
            if (req.files) await imageService.deleteLocalFiles(req.files); 
            return res.status(400).json({ success: false, errors: errorsArray });
        }

        const issueDetails = {
            category: req.body.category,
            description: req.body.description,
            state: req.body.state,
            street_address: req.body.street_address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            photo_upload: []
        };

        try {
            if (req.files) {
                for (const file of req.files) {
                    const uploadResult = await imageService.uploadImageToCloudinary(file.path);
                    issueDetails.photo_upload.push({
                        image_public_url: uploadResult.public_id,
                        image_secure_url: uploadResult.secure_url,
                    });
                    await imageService.deleteLocalFile(file.path);
                }
            }

            const issue = new Issues(issueDetails);
            await issue.save();

            res.status(201).json({ success: true, message: 'Issue created successfully', data: issue });
        } catch (error) {
            console.log(error);
            
            await imageService.deleteLocalFiles(req.files); 
            await imageService.cleanupFailedUpload(issueDetails.photo_upload);
            res.status(500).json({ success: false, errors: [{ msg: "Failed to report issue. Try again!" }] });
        }
    }
];

export const get_issues = async (req, res) => {
    try {
        const issuses = await Issues.find()

        if (!issuses){
            return res.status(404).json({
                status: "fail",
                message: "No Issues found."
            })
        }

        res.status(200).json({
            status: "success",
            message: "Issues fetched successfully",
            data: issuses
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: [{ msg: "Failed to get issues. Try again!" }] });
    }
}
