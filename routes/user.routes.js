import { Router } from 'express';
import { GetUserDetails, LogoutUser } from '../controllers/user.controller.js';

const router = Router();

router.post('/logout', LogoutUser);
router.get('/', GetUserDetails);

export default router;