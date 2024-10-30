import mongoose from "mongoose";

const UserIpSchema = new mongoose.Schema(
    {
        userIp: {
            type: String,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const UserIpModel = mongoose.model("UserIp", UserIpSchema);
export default UserIpModel;