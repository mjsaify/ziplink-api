import mongoose from "mongoose";

const QrCodeSchema = new mongoose.Schema(
    {
        qrCodeImage: {
            type: String,  // Base64 string of the generated QR code image
            required: true,
        },
        expirationDate: {
            type: Date,  // Optional, if you want QR codes to expire after a certain time
        },
        isActive: {
            type: Boolean,
            default: true,  // To mark if the QR code is active or has been deactivated
        },
        scans: {
            type: Number,
            default: 0,  // Number of times this QR code has been scanned
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