import { Router } from 'express';
import { DeleteUserAccount, GetUserDetails, LogoutUser, UpdateUserDetails, UpdateUserPassword } from '../controllers/user.controller.js';

const router = Router();

router.post('/logout', LogoutUser);
router.get('/', GetUserDetails);
router.put('/update/:id', UpdateUserDetails);
router.put('/update/password/:id', UpdateUserPassword);
router.post('/delete/:id', DeleteUserAccount);

export default router;