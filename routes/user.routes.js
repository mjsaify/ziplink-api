import { Router } from 'express';
import { LogoutUser } from '../controllers/user.controller.js';

const router = Router();

router.post('/logout', LogoutUser);

export default router;