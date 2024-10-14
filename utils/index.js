export function validateUrl(value) {
    const urlPattern = new RegExp(
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[\w\-.~:\/?#[\]@!$&'()*+,;%=]*)?$/i
    );

    return urlPattern.test(value);
}