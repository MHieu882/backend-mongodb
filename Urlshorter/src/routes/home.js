import express from 'express';
import homecontroller from '../controller/home.js';

const router = express.Router();

router.get('/', homecontroller.index);
router.post('/shortUrls', homecontroller.ShortUrl);
router.get('/:shortUrl', homecontroller.getShorturl);

export default router;
