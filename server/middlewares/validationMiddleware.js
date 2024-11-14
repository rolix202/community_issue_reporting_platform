import { body } from "express-validator";

export const validate_issues = [
    body("category").notEmpty().withMessage("Issue Category is required.").trim().escape(),
    body("description")
        .notEmpty().withMessage("Description required.")
        .trim().escape()
        .isLength({ min: 20, max: 250 }).withMessage("Description should be 20-500 characters."),
    body("state").notEmpty().withMessage("State is required.").trim().escape(),
    body("street_address").notEmpty().withMessage("Street address required.").trim().escape(),
    body("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("Latitude must be valid."),
    body("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("Longitude must be valid.")
];
