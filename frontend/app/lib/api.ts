import { Category, Product } from '@moneybox/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch all categories from the API
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/categories`);

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

/**
 * Fetch all products from the API
 */
export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  const url = categoryId
    ? `${API_URL}/api/products?categoryId=${categoryId}`
    : `${API_URL}/api/products`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}
