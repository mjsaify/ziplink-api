import { Router } from "express";
import urlRouter from './url.routes.js';

const router = Router();

router.use("/url", urlRouter);

export default router;