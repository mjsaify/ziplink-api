import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../constants.js';

// configuration
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});


export const uploadOnCloudinary = async (base64string) =>{
    try {
        const result = await cloudinary.uploader.upload(base64string, {folder: 'qr-code', resource_type: 'image', format: "jpg"});
        return result
    } catch (error) {
        console.log(error)
        return error;
    }
};