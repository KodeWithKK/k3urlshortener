import { Router } from 'express';
import { shortUrl, getURL } from '../controller/home.controller.js';

const router = Router();

router.route('/').post(shortUrl);
router.route('/:shortId').get(getURL);

export default router;
