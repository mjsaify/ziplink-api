export const DB_URI = process.env.DB_URI + "/" + process.env.DB_NAME;
export const PORT = process.env.PORT;
export const BASE_URL = process.env.BASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const CookieOptions = {
    httpOnly: true,
    secure: true,
}