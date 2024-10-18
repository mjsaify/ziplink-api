export function validateUrl(value) {
    const urlPattern = new RegExp(
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[\w\-.~:\/?#[\]@!$&'()*+,;%=]*)?$/i
    );
    return urlPattern.test(value);
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
}