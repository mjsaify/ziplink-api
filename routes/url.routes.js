import { Router } from "express";
import { DeleteUrl, DownloadQrCode, GetAllUrl, GetSingleUrl, ShortUrl, UpdateUrl } from "../controllers/url.controller.js";

const router = Router();

router.get("/", GetAllUrl);
router.post("/short-url", ShortUrl);
router.get("/links/:id", GetSingleUrl);
router.put("/links/:id", UpdateUrl);
router.delete("/links/delete/:id", DeleteUrl);
router.get("/links/download/:id", DownloadQrCode);



export default router;