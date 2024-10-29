import { Router } from "express";
import { GetAllUrl, GetSingleUrl, ShortUrl, UpdateUrl } from "../controllers/url.controller.js";

const router = Router();

router.post("/short-url", ShortUrl);
router.get("/", GetAllUrl);
router.get("/links/:id", GetSingleUrl);
router.put("/links/:id", UpdateUrl);



export default router;