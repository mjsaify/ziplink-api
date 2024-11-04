export const DB_URI = process.env.DB_URI + "/" + process.env.DB_NAME;
export const PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL;
export const SHORT_URL = process.env.SHORT_URL + ":" + PORT;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const CookieOptions = {
    httpOnly: true,
    secure: false, 
    sameSite: 'Lax' 
}
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const IP_LOCATION_API_KEY = process.env.IP_LOCATION_API_KEY;
export const IP_LOCATION_URI = process.env.IP_LOCATION_URI;
