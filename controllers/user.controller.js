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
                msg: "Email already registered",
            });
        };

        const user = await UserModel.create({
            email, password
        });

        return res.status(201).json({
            status: 200,
            user,
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: "Something went wrong while signup"
        });
    }
}


const UserLogin = async (req, res) => {
    try {
        const parsedInputs = LoginSchema.safeParse(req.body);
        if (!parsedInputs.success) {
            console.log("wrong inputs")
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
            console.log("password incorrect")
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
                msg: "You are logged in",
            });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: "Something went wrong while signup"
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
                msg: "You are loggedout",
            })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: "Something went wrong while logout"
        });
    }
}


export { UserSignup, UserLogin, LogoutUser };