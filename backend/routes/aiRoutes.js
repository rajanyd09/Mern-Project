import express from 'express';
import { askAI, saveInteraction } from '../controllers/aiController.js';

const router = express.Router();

router.post('/ask-ai', askAI);
router.post('/save', saveInteraction);

export default router;
