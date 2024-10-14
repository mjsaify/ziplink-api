import mongoose from "mongoose";

const URLSchema = new mongoose.Schema(
    {
        urlId: { // newly generated url id
            type: String,
            required: true,
        },
        originalUrl: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
            required: true,
        },
        clicks: {
            type: Number,
            required: true,
            default: 0,
        },
        date: {
            type: String,
            default: Date.now,
        },
    },
    {
        timestamps: true
    }
);

const URLModel = mongoose.model('url', URLSchema);
export default URLModel;