import mongoose from "mongoose";

const UserIpSchema = new mongoose.Schema(
    {
        ip: {
            type: String,
            required: true,
        },
        country_code: {
            type: String,
            required: true,
        },
        country_name: {
            type: String,
            required: true,
        },
        region_name: {
            type: String,
            required: true,
        },
        city_name: {
            type: String,
            required: true,
        },
        latitude: {
            type: String,
            required: true,
        },
        longitude: {
            type: String,
            required: true,
        },
        zip_code: {
            type: String,
            required: true,
        },
        time_zone: {
            type: String,
            required: true,
        },
        is_proxy: {
            type: Boolean,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const IpAddressModel = mongoose.model("IpAddress", UserIpSchema);
export default IpAddressModel;