import express from 'express';

import UserController from '../controller/user.js';

const router = express.Router();
router.post('/home', UserController.home);
router.post('/register', UserController.register);
router.get('/logout', UserController.logout);
router.post('/delete', UserController.DestroyUrl);
router.get('/', UserController.index);

export default router;
