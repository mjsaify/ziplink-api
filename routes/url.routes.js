import { Router } from "express";
import { GetAllUrl, ShortUrl } from "../controllers/url.controller.js";

const router = Router();

router.post("/short-url", ShortUrl);
router.get("/", GetAllUrl);


export default router;