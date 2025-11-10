import { describe, it, expect } from 'vitest';
import { getCategories, getProducts, getProductsByCategory } from '../../services/contentful';

describe('Contentful Service', () => {
  describe('Data Transformation', () => {
    it('should transform Contentful categories to clean domain models', async () => {
      const categories = await getCategories();

      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);

      const category = categories[0];

      // Validates service layer mapping: Contentful Entry → Category
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('order');

      // Should NOT have Contentful-specific fields (proves abstraction works)
      expect(category).not.toHaveProperty('sys');
      expect(category).not.toHaveProperty('fields');
      expect(category).not.toHaveProperty('metadata');
    });

    it('should transform Contentful products to clean domain models', async () => {
      const products = await getProducts();

      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThan(0);

      const product = products[0];

      // Validates service layer mapping: Contentful Entry → Product
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('categoryId');
      expect(product).toHaveProperty('image');

      // Should NOT have Contentful-specific fields (proves abstraction works)
      expect(product).not.toHaveProperty('sys');
      expect(product).not.toHaveProperty('fields');
      expect(product).not.toHaveProperty('metadata');
    });

    it('should correctly extract image URLs from Contentful assets', async () => {
      const products = await getProducts();

      expect(products.length).toBeGreaterThan(0);

      const product = products[0];

      // Validates "Show an Image" requirement from brief
      expect(product.image).toBeTruthy();
      expect(typeof product.image).toBe('string');

      // Image should be a URL (starts with // from Contentful CDN)
      expect(product.image).toMatch(/^\/\//);
    });

    it('should correctly map rich text descriptions', async () => {
      const products = await getProducts();

      expect(products.length).toBeGreaterThan(0);

      const product = products[0];

      // Validates "Show Description" requirement from brief
      expect(product.description).toBeTruthy();
      expect(product.description).toHaveProperty('nodeType');
      expect(product.description.nodeType).toBe('document');

      // Rich text should have content nodes
      expect(product.description).toHaveProperty('content');
      expect(Array.isArray(product.description.content)).toBe(true);
    });

    it('should correctly extract categoryId from linked entries', async () => {
      const products = await getProducts();

      expect(products.length).toBeGreaterThan(0);

      const product = products[0];

      // Validates category linking works
      expect(product.categoryId).toBeTruthy();
      expect(typeof product.categoryId).toBe('string');
      expect(product.categoryId.length).toBeGreaterThan(0);
    });
  });

  describe('Category Filtering', () => {
    it('should filter products by category ID', async () => {
      // First get a valid category ID
      const allProducts = await getProducts();
      const testCategoryId = allProducts[0].categoryId;

      // Get products filtered by category
      const filteredProducts = await getProductsByCategory(testCategoryId);

      expect(filteredProducts).toBeInstanceOf(Array);
      expect(filteredProducts.length).toBeGreaterThan(0);

      // All products should have the same categoryId
      filteredProducts.forEach((product) => {
        expect(product.categoryId).toBe(testCategoryId);
      });
    });

    it('should return products with category filtering parameter', async () => {
      const categories = await getCategories();
      const firstCategoryId = categories[0].id;

      const products = await getProductsByCategory(firstCategoryId);

      // Validates "Display products within a Category" requirement
      expect(products).toBeInstanceOf(Array);
      products.forEach((product) => {
        expect(product.categoryId).toBe(firstCategoryId);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing image URLs gracefully', async () => {
      const products = await getProducts();

      // Even if an image is missing, should return empty string (not crash)
      products.forEach((product) => {
        expect(typeof product.image).toBe('string');
      });
    });

    it('should handle optional category descriptions', async () => {
      const categories = await getCategories();

      // Descriptions are optional for categories
      categories.forEach((category) => {
        if (category.description) {
          expect(category.description).toHaveProperty('nodeType');
        }
      });
    });
  });
});
