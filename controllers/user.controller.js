import { SignupSchema, LoginSchema, UpdateUserNameAndEmail, UpdateUserPasswordSchema } from '../utils/_types.js';
import UserModel from '../models/user.model.js';
import { generateAccessAndRefreshToken } from '../utils/index.js';
import { CookieOptions } from '../constants.js';
import argon2 from 'argon2';


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
        const { fullname, email, password } = parsedInputs.data;
        const isUserExist = await UserModel.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        };

        await UserModel.create({
            fullname, email, password
        });

        return res.status(201).json({
            success: true,
            message: "Registration Sucesfull",
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Something went wrong while signup"
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
                message: "Invalid Credentials"
            });
        };

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Credentials"
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


const CheckAuthSession = async (req, res) => {
    try {
        if (!req.user) {
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


const GetUserDetails = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password -refreshToken -updatedAt").populate({
            path: "url", select: "-updatedAt -urlId", populate: {
                path: "qrCode",
                select: "-updatedAt -createdAt -public_id -qrCodeImage -qrCodeUrl -createdAt"
            }
        });
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

const UpdateUserDetails = async (req, res) => {
    try {
        const parsedInputs = UpdateUserNameAndEmail.safeParse(req.body);
        const { id } = req.params;

        console.log(parsedInputs.data)
        if (!parsedInputs.success) {
            return res.status(400).json({
                success: false,
                message: "One of the field is required",
            });
        };

        let updates = {}
        if (parsedInputs.data.fullname) updates.fullname = parsedInputs.data.fullname;
        if (parsedInputs.data.email) updates.email = parsedInputs.data.email;

        await UserModel.findByIdAndUpdate(
            id,
            {
                $set: updates,
            },
            {
                new: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Profile Updated"
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Could not update profile, please try later"
        });
    }
};


const UpdateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedInputs = UpdateUserPasswordSchema.safeParse(req.body);


        if (!parsedInputs.success) {
            return res.status(400).json({
                success: false,
                message: "Could not update password, please try later"
            });
        };

        const hashPassword = await argon2.hash(parsedInputs.data.confirmPassword);

        const user = await UserModel.findByIdAndUpdate(id, {
            password: hashPassword,
        });


        if (!user) {
            return res.status(400).json({
                success: true,
                message: "Could not update password, please try later"
            });
        };

        user.refreshToken = "";
        await user.save();

        return res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({
                success: true,
                message: "Password Changed, Please login again"
            });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Could not update password, please try later"
        });
    }
};


const DeleteUserAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Could not attempt action, please try later"
            });
        };

        return res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({
                success: true,
                message: "Account Deleted Successfully"
            });


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Could not attempt action, please try later"
        });
    }
}


export { UserSignup, UserLogin, LogoutUser, CheckAuthSession, GetUserDetails, UpdateUserDetails, UpdateUserPassword, DeleteUserAccount };