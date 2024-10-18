import { Router } from "express";
import { GetAllUrl, ShortUrl } from "../controllers/url.controller.js";
import QRCode from 'qrcode';

const router = Router();

router.post("/short-url", ShortUrl);
router.get("/", GetAllUrl);

router.get('/generate-qr', async (req, res) => {
    const generateQR = async text => {
        try {
            const qrCode = await QRCode.toDataURL(text);
            return qrCode;
        } catch (err) {
            console.error(err)
            return null;
        }
    };
    const qrCode = await generateQR("http://www.example.com");
    if (qrCode) {
        console.log(qrCode)
        // Return the base64-encoded QR code to the client
        return res.status(200).send(`
                <h1>QrCode Generator</h1>
                <br/>
                <img src=${qrCode} art="qrcode" />
            `);
    } else {
        return res.status(500).json({ error: 'Failed to generate QR code' });
    }
});



export default router;