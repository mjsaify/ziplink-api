import { Router } from "express";
import urlRouter from './url.routes.js';
import userRouter from './user.routes.js';

const router = Router();

router.use("/url", urlRouter);
router.use("/user", userRouter);

export default router;