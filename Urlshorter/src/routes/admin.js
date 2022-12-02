import express from 'express';
import adminController from '../controller/admin.js';

const router = express.Router();
// admin
router.post('/logoutuser',adminController.logoutuser);
router.post('/Disable', adminController.disable);
router.post('/Active', adminController.active);
router.post('/deletebyadmin', adminController.deletebyadmin);
export default router;

