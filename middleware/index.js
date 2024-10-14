// Middleware to calculate and log request size
const logRequestSize = (req, res, next) => {
    let requestSize = 0;
    
    req.on('data', (chunk) => {
        requestSize += Buffer.from(chunk).length;
    });

    req.on('end', () => {
        console.log(`Request size for ${req.path}: ${requestSize} bytes`);
        next();
    });

    // Handle cases where there's no request body
    if (!req.readable) {
        console.log(`Request size for ${req.path}: ${requestSize} bytes`);
        next();
    }
};