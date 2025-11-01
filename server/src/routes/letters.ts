import express from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { supabaseAdmin } from '../supabase/client';

// router responsible for letter-related endpoints
const router = express.Router();

/**
 * Endpoint to save the letter text to a file. (temp)
 */
router.post('/save', requireAuth, async (req, res) => {
  const { content, title, user } = req.body;
  if (typeof content !== 'string') return res.status(400).json({ error: 'Invalid text' });


  try {
    const {data, error} = await supabaseAdmin
      .from('letters_content')
      .insert([{ content: content, title: title, user_id: user.id }])
      .select();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save letter to database' });
    }

    return res.json({ success: true, letterId: data[0].id });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Failed to save letter' });
  }
});

export default router;

/**
 * Some ideas for later:
 * - Store letters in a database with letter id -> timestamp + user id
 * - letters saved as txt in supabase for now
 * - Could also include a unique title for each letter per user?
 * 
 */