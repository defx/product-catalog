import { Router, Request, Response } from 'express';
import { getProducts, getProductsByCategory } from '../services/contentful';

const router = Router();

/**
 * GET /api/products
 * Fetch all products from Contentful
 * Optional query param: categoryId - filter products by category
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;

    if (categoryId && typeof categoryId === 'string') {
      const products = await getProductsByCategory(categoryId);
      res.json(products);
    } else {
      const products = await getProducts();
      res.json(products);
    }
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
