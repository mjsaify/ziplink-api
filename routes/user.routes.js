import { Router } from 'express';
import { LogoutUser, UserLogin, UserSignup } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/signup', UserSignup);
router.post('/login', UserLogin);
router.post('/logout', auth, LogoutUser);

router.get("/user-auth", auth, async (req, res) => {
    res.send("ok");
});


export default router;