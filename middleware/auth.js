import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants.js';


const auth = async (req, res, next) =>{
    try {
        const cookies = req.headers.cookie;
        if(cookies === undefined){
            return res.status(400).json({
                msg: "404 Bad Request"
            });
        }
        const token = cookies.split(";")[0].split("=")[1];
        if (!token) {
            return res.status(400).json({
                msg: "Invalid request token"
            });
        }
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "Invalid request token"
        });
    }
};

export default auth;