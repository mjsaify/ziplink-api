import { nanoid } from 'nanoid';
import { ExpirationDate, GenearateQrCode, validateUrl } from '../utils/index.js';
import URLModel from '../models/url.model.js';
import { SHORT_URL } from '../constants.js';
import { uploadOnCloudinary } from '../utils/file-upload.js'
import QRCodeModel from '../models/qrcode.model.js';
import { UrlSchema } from '../utils/_types.js';
import { z } from 'zod';



const GetAllUrl = async (_, res) => {
    try {
        const urls = await URLModel.find().populate('qrCode');
        if (urls.length < 1) {
            return res.status(200).json({
                error: "...Oops No Url Found",
            });
        };

        return res.status(200).json(urls);
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Something went wrong while fetching urls",
            error,
        });
    }
};


const GetSingleUrl = async (req, res) => {
    try {
        const urlId = req.params.id;

        const url = await URLModel.findById(urlId).populate("qrCode");
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "404 Url Not Found"
            })
        };

        return res.status(200).json({
            success: true,
            url,
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
        const url = await URLModel.findOne({ originalUrl });
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

            const qrCode = await GenearateQrCode(shortUrl);
            if (!qrCode) {
                return res.status(500).json({ error: 'Failed to generate QR code' });
            };

            const qrImage = await uploadOnCloudinary(qrCode);

            // save qrcode
            const qrModel = await QRCodeModel.create({
                qrCodeImage: qrImage.url,
            });

            // save url
            await URLModel.create({
                title,
                urlId,
                originalUrl,
                shortUrl,
                qrCode: qrModel._id,
                customLink,
                expiresAt
            });

            return res.status(201).json({
                success: true,
                message: "URL Generated",
            });

        } else {
            // generate new id
            const urlId = nanoid(8);
            const shortUrl = `${SHORT_URL}/${urlId}`;

            // genearate qr code
            const qrCode = await GenearateQrCode(shortUrl);
            if (!qrCode) {
                return res.status(500).json({ error: 'Failed to generate QR code' });
            };

            // upload on cloudinary
            const qrImage = await uploadOnCloudinary(qrCode);

            // save qrcode
            const qrModel = await QRCodeModel.create({
                qrCodeImage: qrImage.url,
            });

            // save url
            await URLModel.create({
                title,
                urlId,
                originalUrl,
                shortUrl,
                qrCode: qrModel._id,
                expiresAt
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
        const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        const url = await URLModel.findOne({ customLink: urlId });
        console.log(url)
        if (!url) {
            return res.status(200).json({
                message: "Invalid url",
            });
        };


        if (requestUrl !== url.shortUrl) {
            return res.status(200).json({
                message: "Invalid url",
            });
        };

        await URLModel.updateOne(
            {
                urlId
            },
            {
                $inc: { clicks: 1 },
            },
            {
                new: true
            });

        return res.redirect(url.originalUrl);
    } catch (error) {
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
}


export { GetAllUrl, ShortUrl, RedirectOriginalUrl, GetSingleUrl, UpdateUrl };