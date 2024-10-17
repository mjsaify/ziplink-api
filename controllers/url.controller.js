import { nanoid } from 'nanoid';
import { validateUrl } from '../utils/index.js';
import URLModel from '../models/url.model.js';
import { BASE_URL } from '../constants.js';



const GetAllUrl = async (req, res) => {
    try {
        const urls = await URLModel.find();
        if(urls.length < 1){
            return res.status(200).json({
                error: "...Oops No Url Found",
            });
        }

        return res.status(200).json(urls);
    } catch (error) {
        return res.status(400).json({
            msg: "Something went wrong while fetching urls",
            error,
        });
    }
}

const ShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({
                msg: "Url Field is Empty"
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

        const newShortUrl = await URLModel.create({
            urlId,
            originalUrl,
            shortUrl,
        });

        return res.status(201).json({
            msg: "URL Generated",
            url: newShortUrl,
        });
    } catch (error) {
        return res.status(400).json({
            msg: "Something went wrong",
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


export { ShortUrl, RedirectOriginalUrl, GetAllUrl };