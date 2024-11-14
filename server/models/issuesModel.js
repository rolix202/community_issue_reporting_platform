import mongoose from "mongoose";

const issuesSchema = new mongoose.Schema({
    category: {
        type: String,
        lowercase: true,
        required: [true, "Issue category is required"]
    },
    description: {
        type: String,
        lowercase: true,
        required: [true, "Description is required"],
        minLength: [20, "Description should be 20-500 characters long"],
        maxLength: [250, "Description should be 20-500 characters long"]
    },
    state: {
        type: String,
        lowercase: true,
        required: [true, "State is required"]
    },
    street_address: {
        type: String,
        lowercase: true,
        required: [true, "Street address is required"]
    },
    status: {
        type: String,
        enum: ["open", "in progress", "resolved", "closed"],
        default: "open",
    },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    photo_upload: [{
        image_public_url: { type: String, required: true },
        image_secure_url: { type: String, required: true }
    }]
});

const Issues = mongoose.model("Issues", issuesSchema);

export default Issues;
