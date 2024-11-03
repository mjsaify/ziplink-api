import { nanoid } from 'nanoid';
import { ExpirationDate, findLocation, GenearateQrCode } from '../utils/index.js';
import URLModel from '../models/url.model.js';
import { SHORT_URL } from '../constants.js';
import { uploadOnCloudinary } from '../utils/file-upload.js'
import QRCodeModel from '../models/qrcode.model.js';
import { UrlSchema } from '../utils/_types.js';
import { z } from 'zod';
import IpAddressModel from '../models/ipaddessmodel.js';
import UserModel from '../models/user.model.js';



const GetAllUrl = async (req, res) => {
    try {
        const urls = await UserModel.findById(req.user.id).populate({ path: "url", populate: { path: "qrCode" } });
        if (urls?.length < 1) {
            return res.status(200).json({
                sucees: false,
                message: "...Oops No Url Found",
            });
        };

        return res.status(200).json(urls);
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while fetching urls",
        });
    }
};


const GetSingleUrl = async (req, res) => {
    try {
        const urlId = req.params.id;

        const user = await UserModel.findById(req.user.id).populate({ path: "url", populate: { path: "qrCode" } });
        const url = user.url.find((url) => url._id.toString() === urlId);

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "404 Url Not Found"
            })
        };

        return res.status(200).json({
            success: true,
            url
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Something went wrong while fetching single url",
            error,
        });
    }
}

const ShortUrl = async (req, res) => {
    try {
        const parsedInputs = UrlSchema.safeParse(req.body);
        const expiresAt = ExpirationDate();
        if (!parsedInputs.success) {
            return res.status(400).json({
                success: false,
                message: "Fields are required",
            });
        };
        const { title, originalUrl, customLink } = parsedInputs.data;

        // check if url exist in db, then return it
        const user = await UserModel.findById(req.user.id).populate({ path: "url", populate: { path: "qrCode" }});
        const url = user.url.find((item) => item.originalUrl === originalUrl);

        if (url) {
            return res.status(200).json({
                success: true,
                message: "Url already exist",
            });
        };

        if (customLink) {
            // check if custom link exist
            const customLinkExist = await URLModel.findOne({ customLink });
            if (customLinkExist) {
                return res.status(400).json({
                    success: false,
                    error: 'Custom link cannot be same'
                });
            };
            const urlId = nanoid(8);
            const shortUrl = `${SHORT_URL}/${customLink}`;
            const qrCodeUri = `${shortUrl}/?source=qr`;

            const qrCode = await GenearateQrCode(shortUrl);
            if (!qrCode) {
                return res.status(500).json({ error: 'Failed to generate QR code' });
            };

            const qrImage = await uploadOnCloudinary(qrCode);

            // save qrcode
            const qrModel = await QRCodeModel.create({
                qrCodeUrl: qrCodeUri,
                qrCodeImage: qrImage.url,
                public_id: qrImage.public_id,
            });

            // save url
            const newUrl = await URLModel.create({
                title,
                urlId,
                originalUrl,
                shortUrl,
                qrCode: qrModel._id,
                customLink,
                expiresAt,
                createdBy: req.user.id,
            });

            await UserModel.findByIdAndUpdate({ _id: req.user.id }, {
                $push: {
                    url: newUrl._id,
                },

            },
                {
                    new: true,
                })

            return res.status(201).json({
                success: true,
                message: "URL Generated",
            });

        } else {
            // generate new id
            const urlId = nanoid(8);
            const shortUrl = `${SHORT_URL}/${urlId}`;
            const qrCodeUri = `${shortUrl}/?source=qr`

            // genearate qr code
            const qrCode = await GenearateQrCode(shortUrl);
            if (!qrCode) {
                return res.status(500).json({ error: 'Failed to generate QR code' });
            };

            // upload on cloudinary
            const qrImage = await uploadOnCloudinary(qrCode);

            // save qrcode
            const qrModel = await QRCodeModel.create({
                qrCodeUrl: qrCodeUri,
                qrCodeImage: qrImage.url,
                public_id: qrImage.public_id,
            });

            // save url
            const newUrl = await URLModel.create({
                title,
                urlId,
                originalUrl,
                shortUrl,
                qrCode: qrModel._id,
                expiresAt,
                createdBy: req.user.id,
            });


            await UserModel.findByIdAndUpdate({ _id: req.user.id }, {
                $push: {
                    url: newUrl._id,
                },

            },
                {
                    new: true,
                });

            return res.status(201).json({
                success: true,
                message: "URL Generated",
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while shortening url",
            error,
        });
    }
};


const RedirectOriginalUrl = async (req, res) => {
    try {
        const { urlId } = req.params;
        const source = req.query.source;

        const url = await URLModel.findOne({
            $or: [
                { customLink: urlId },
                { urlId }
            ]
        });

        if (!url) {
            return res.status(200).json({
                message: "Invalid url",
            });
        };

        // comparing dates
        const currentDate = new Date().toISOString();
        if (currentDate > url.expiresAt) {
            return res.status(400).json({
                success: false,
                message: "URL is Expired"
            });
        };

        // Check if it's a QR code scan
        if (source === "qr") {
            await QRCodeModel.updateOne(
                {
                    _id: url.qrCode
                },
                {
                    $inc: {
                        scans: 1
                    }
                },
                {
                    new: true
                }

            );
            return res.redirect(url.originalUrl);
        }


        // check url status
        if (url.urlStatus === "active") {
            // check for unique ip
            const userIp = await IpAddressModel.findOne({ ip: "150.161.235.107" });
            const clickQuery = {
                $inc: {
                    clicks: 1
                },
            };

            if (!userIp) {
                // find location through ip
                const location = await findLocation("150.161.235.107");

                // update clickQuery with uniqueClick property
                clickQuery.$inc.uniqueClicks = 1
                await IpAddressModel.create(location);
            };

            await URLModel.updateOne(
                {
                    $or: [
                        { customLink: urlId },
                        { urlId }
                    ]
                },
                clickQuery,
                {
                    new: true
                });

            return res.redirect(url.originalUrl);
        } else if (url.urlStatus === "inactive" || url.urlStatus === "expired") {
            return res.status(400).json({
                success: false,
                message: "404 Not Found"
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Something went wrong while redirecting",
            error,
        });
    }
};

const UpdateUrl = async (req, res) => {
    try {
        const zodValidation = z.object({
            expiresAt: z.string().datetime(),
            urlStatus: z.string(),
        });

        const parsedInputs = zodValidation.safeParse(req.body);
        if (!parsedInputs.success) {
            return res.status(400).json({ error: 'Invalid Fields' });
        };

        const url = await URLModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    expiresAt: parsedInputs.data.expiresAt,
                    urlStatus: parsedInputs.data.urlStatus,
                }
            },
            {
                new: true,
            }
        );

        if (!url) {
            return res.status(400).json({
                sucees: false,
                message: "Url could not update",
                error,
            });
        };

        return res.status(201).json({
            success: true,
            message: "URL Updated",
        });


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: "Something went wrong while upating url"
        });
    }
};


const DeleteUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const url = await URLModel.findByIdAndDelete(id);
        if (!url) {
            return res.status(400).json({
                sucees: false,
                message: "Could not delete url",
            });
        };

        await UserModel.findByIdAndUpdate(url.createdBy, // Find the user who created the URL
            {
                $pull: {
                    url: url._id, // Remove the URL ID from the url array
                }
            });

        return res.status(200).json({
            success: true,
            message: "Url deleted successfully",
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: "Something went wrong while deleting url"
        });
    }
}


const DownloadQrCode = async (req, res) => {
    try {
        const { id } = req.params;
        const url = await URLModel.findById(id).populate("qrCode");
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "404 Url Not Found"
            })
        };

        url.qrCode.downloads += 1;
        await url.qrCode.save();

        return res.status(200).json({ success: true });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: "Something went wrong while downloading"
        });
    }
}

export { GetAllUrl, ShortUrl, RedirectOriginalUrl, GetSingleUrl, UpdateUrl, DeleteUrl, DownloadQrCode };