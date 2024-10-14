import { Router } from "express";
import { ShortUrl } from "../controllers/url.controller.js";

const router = Router();

router.post("/short-url", ShortUrl);


export default router;