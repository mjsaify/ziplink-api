import mongoose from "mongoose";

const URLSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        urlId: {
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
        urlStatus: {
            type: String,
            enum: ['active', 'inactive', 'expired'],
            default: 'active',
        },
        qrCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Qrcode"
        },
        customLink: {
            type: String,
        },
        expiresAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const URLModel = mongoose.model('url', URLSchema);
export default URLModel;