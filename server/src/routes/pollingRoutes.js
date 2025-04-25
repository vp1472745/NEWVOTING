import express from 'express';
import { createPolling, getCurrentPolling } from '../controller/pollingController.js';
import { organizationProtect } from '../middlewares/authMiddleware.js';
import { pollingProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/',pollingProtect, getCurrentPolling);
router.post("/create", createPolling);

export default router;