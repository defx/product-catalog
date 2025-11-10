import { Router, Request, Response } from 'express';
import { getCategories } from '../services/contentful';

const router = Router();

/**
 * GET /api/categories
 * Fetch all categories from Contentful
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
