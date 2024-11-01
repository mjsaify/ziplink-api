import { Router } from "express";
import urlRouter from './url.routes.js';
import userRouter from './user.routes.js';
import { CheckAuthSession, UserLogin, UserSignup } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

// protected routes
router.use("/url", auth, urlRouter);
router.use("/user", auth, userRouter);
router.use("/auth/check-session", auth, CheckAuthSession);

// Non-protected routes
router.post('/signup', UserSignup);
router.post('/login', UserLogin);


export default router;