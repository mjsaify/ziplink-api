import mongoose from "mongoose";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../constants.js";


const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);


// hash password before saving user
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await argon2.hash(this.password);
});

// verify password
UserSchema.methods.isPasswordCorrect = async function (userPassword) {
    return await argon2.verify(this.password, userPassword);
};

// generate access token
UserSchema.methods.generateAccessToken = async function () {
    const payload = {
        id: this._id,
        email: this.password,
    };

    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

// generate refresh token
UserSchema.methods.generateRefreshToken = async function () {
    const payload = {
        id: this._id,
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;