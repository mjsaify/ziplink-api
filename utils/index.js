import QRCode from 'qrcode';
import { IP_LOCATION_API_KEY, IP_LOCATION_URI } from '../constants.js';


export const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);
    }
};


export const GenearateQrCode = async (url) => {
    try {
        const qrCodeUrl = `${url}/?source=qr`; // implementing id for tracking scans
        const qrCode = await QRCode.toDataURL(qrCodeUrl, { type: 'image/jpeg' });
        return qrCode;
    } catch (err) {
        console.error(err)
        return err;
    }
};

export const ExpirationDate = () => {
    const currentDate = new Date();  // Get current date
    const expirationDate = new Date(currentDate);  // Clone the current date

    // Set expiration date to 7 days in the future
    expirationDate.setDate(expirationDate.getDate() + 7);

    // Convert to ISO format
    return expirationDate.toISOString();
};


export const findLocation = async (ip) =>{
    try {
        const request = await fetch(`${IP_LOCATION_URI}/?key=${IP_LOCATION_API_KEY}&ip=${ip}&format=json`);
        const response = await request.json();
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}