import { SignupSchema, LoginSchema } from '../utils/_types.js';
import UserModel from '../models/user.model.js';
import { generateAccessAndRefreshToken } from '../utils/index.js';
import { CookieOptions } from '../constants.js';


const UserSignup = async (req, res) => {
    try {
        const parsedInputs = SignupSchema.safeParse(req.body);
        if (!parsedInputs.success) {
            return res.status(400).json({
                errors: parsedInputs.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                }))
            });
        }
        const { email, password } = parsedInputs.data;
        const isUserExist = await UserModel.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                msg: "Email already registered",
            });
        };

        await UserModel.create({
            email, password
        });

        return res.status(201).json({
            success: true,
            message: "Registration Sucesfull",
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            msg: "Something went wrong while signup"
        });
    }
}


const UserLogin = async (req, res) => {
    try {
        const parsedInputs = LoginSchema.safeParse(req.body);
        if (!parsedInputs.success) {
            return res.status(400).json({
                errors: parsedInputs.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                }))
            });
        };

        const { email, password } = parsedInputs.data;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: "Invalid Credentials"
            });
        };

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                msg: "Invalid Credentials"
            });
        };

        // generate access and refresh token
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

        return res
            .status(200)
            .cookie("accessToken", accessToken, CookieOptions)
            .cookie("refreshToken", refreshToken, CookieOptions)
            .json({
                status: 200,
                success: true,
                message: "Login successfull",
            });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Something went wrong while signup"
        });
    }
};


const LogoutUser = async (req, res) => {
    try {
        // reset refresh token
        const userId = req.user.id;
        await UserModel.findByIdAndUpdate(userId, {
            $set: {
                refreshToken: "",
            }
        }, {
            new: true,
        });

        // remove cookies
        return res
            .status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({
                status: 200,
                success: true,
                message: "Logout successfull",
            });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Something went wrong while logout"
        });
    }
};


const CheckAuthSession = async (req, res) =>{
    try {
        if(!req.user){
            return res.status(400).json({
                success: false,
                message: "Unauthorized request"
            });
        }

        res.status(200).json({
            success: true,
            message: "Authorized"
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Unauthorized request"
        });
    }
}


export { UserSignup, UserLogin, LogoutUser, CheckAuthSession };