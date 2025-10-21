import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../supabase/client';


/**
 * Middleware to require authentication via Supabase.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {

    const token = req.cookies?.sb_access_token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    // Verify token with Supabase admin client
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Attach user to request for downstream handlers
    (req as any).user = data.user;
    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    res.status(500).json({ error: 'Auth check failed' });
  }
}
