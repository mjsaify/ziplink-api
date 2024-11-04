import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants.js';


const auth = async (req, res, next) =>{
    try {
        const token = req.cookies;
        if(token === undefined){
            return res.status(400).json({
                success: false,
                message: "Invalid request token"
            });
        }
        const accessToken = token.accessToken;
        if (!accessToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid request token"
            });
        }
        const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Invalid request token"
        });
    }
};

export default auth;
