import { Router } from "express";
import { GetAllUrl, GetSingleUrl, ShortUrl } from "../controllers/url.controller.js";

const router = Router();

router.post("/short-url", ShortUrl);
router.get("/", GetAllUrl);
router.get("/links/:id", GetSingleUrl)



export default router;