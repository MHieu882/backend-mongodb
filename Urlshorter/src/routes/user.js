import express from 'express';
import UserController from '../controller/user.js';

const router = express.Router();
// user
router.post('/home', UserController.login);
router.post('/register', UserController.register);
router.get('/logout', UserController.logout);
router.post('/delete', UserController.DestroyUrl);
router.get('/getchange', UserController.getchange);
router.post('/changepasss', UserController.Changepass);
// guest
router.post('/reset',UserController.sendmail)
router.get('/reset',UserController.getreset)
router.get('/', UserController.index);

export default router;

