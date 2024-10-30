import mongoose from "mongoose";

const QrCodeSchema = new mongoose.Schema(
    {
        qrCodeUrl: {
            type: String,
            required: true,
        },
        qrCodeImage: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,  // To mark if the QR code is active or has been deactivated
        },
        scans: {
            type: Number,
            default: 0,  // Number of times this QR code has been scanned
        },
        downloads: {
            type: Number,
            default: 0
        },
        lastScannedAt: {
            type: Date,  // To keep track of the last time the QR code was scanned
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const QRCodeModel = mongoose.model('Qrcode', QrCodeSchema);
export default QRCodeModel;