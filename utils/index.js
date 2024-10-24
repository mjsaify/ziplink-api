import QRCode from 'qrcode';

export function validateUrl(value) {
    const urlPattern = new RegExp(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[\w\-.~:\/?#[\]@!$&'()*+,;%=]*)?$/i);
    return urlPattern.test(value); // true or false
};


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
        const qrCode = await QRCode.toDataURL(url, { type: 'image/jpeg' });
        return qrCode;
    } catch (err) {
        console.error(err)
        return err;
    }
};