import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { requireAuth } from '../middleware/requireAuth';
// router responsible for letter-related endpoints
const router = express.Router();

/**
 * Endpoint to save the letter text to a file. (temp)
 */
router.post('/save-letter', requireAuth, async (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') return res.status(400).json({ error: 'Invalid text' });

  const dir = path.join(process.cwd(), 'src', 'db');
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, 'letter.txt');

  try {
    await fs.writeFile(filePath, text, 'utf8');
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to save letter', err);
    return res.status(500).json({ error: 'Failed to save letter' });
  }
});

export default router;