import { nanoid } from 'nanoid';
import { GenearateQrCode, validateUrl } from '../utils/index.js';
import URLModel from '../models/url.model.js';
import { BASE_URL } from '../constants.js';
import { uploadOnCloudinary } from '../utils/file-upload.js'
import QRCodeModel from '../models/qrcode.model.js';



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
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                message: "Url Field is Empty"
            });
        };

        if (!validateUrl(originalUrl)) {
            return res.status(400).json({
                msg: "Invalid URL"
            });
        };

        // check if url exist in db, then return it
        const isExistedUrl = await URLModel.findOne({ originalUrl });
        if (isExistedUrl) {
            return res.status(200).json({
                url: isExistedUrl.shortUrl,
            });
        };

        // generate new id
        const urlId = nanoid(8);
        const shortUrl = `${BASE_URL}/${urlId}`;

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
            urlId,
            originalUrl,
            shortUrl,
            qrCode: qrModel._id,
        });

        return res.status(201).json({
            success: true,
            message: "URL Generated",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};


const RedirectOriginalUrl = async (req, res) => {
    try {
        const { userId } = req.params.userId;
        const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        const url = await URLModel.findOne({ userId });

        if (!url) {
            return res.status(200).json({
                msg: "Invalid url",
            });
        };

        if (requestUrl !== url.shortUrl) {
            return res.status(200).json({
                msg: "Invalid url",
            });
        };

        await URLModel.updateOne(
            {
                userId
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
            msg: "Something went wrong while redirecting",
            error,
        });
    }
}


export { GetAllUrl, ShortUrl, RedirectOriginalUrl, GetSingleUrl };