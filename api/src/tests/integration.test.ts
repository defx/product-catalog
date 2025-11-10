import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";
import { getCategories, getProducts } from "../services/contentful";

describe("API Integration Tests", () => {
  describe("GET /api/categories", () => {
    it("should return an array of categories with correct structure", async () => {
      const response = await request(app)
        .get("/api/categories")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      const category = response.body[0];
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("order");
      expect(typeof category.id).toBe("string");
      expect(typeof category.name).toBe("string");
      expect(typeof category.order).toBe("number");
    });

    it("should return categories ordered by order field", async () => {
      const response = await request(app).get("/api/categories").expect(200);

      const orders = response.body.map((cat: any) => cat.order);
      const sortedOrders = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sortedOrders);
    });

    it("should return all required fields for categories", async () => {
      const response = await request(app).get("/api/categories").expect(200);

      response.body.forEach((category: any) => {
        expect(category.id).toBeTruthy();
        expect(category.name).toBeTruthy();
        expect(typeof category.order).toBe("number");

        // Description is optional
        if (category.description) {
          expect(category.description.nodeType).toBe("document");
        }
      });
    });
  });

  describe("GET /api/products", () => {
    it("should return an array of products with correct structure", async () => {
      const response = await request(app)
        .get("/api/products")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      const product = response.body[0];
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("categoryId");
      expect(product).toHaveProperty("image");
      expect(typeof product.id).toBe("string");
      expect(typeof product.name).toBe("string");
      expect(typeof product.categoryId).toBe("string");
      expect(typeof product.image).toBe("string");
    });

    it("should return products with images and descriptions (brief requirements)", async () => {
      const response = await request(app).get("/api/products").expect(200);

      const product = response.body[0];

      // Validates "Show an Image & Description for each Product" requirement
      expect(product.image).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.description).toHaveProperty("nodeType");
      expect(product.description.nodeType).toBe("document");
    });

    it("should return all required fields for products", async () => {
      const response = await request(app).get("/api/products").expect(200);

      response.body.forEach((product: any) => {
        // Validates all brief requirements are met
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.categoryId).toBeTruthy();
        expect(product.image).toBeTruthy(); // "Show an Image" requirement
        expect(product.description).toBeTruthy(); // "Show Description" requirement
        expect(product.description.nodeType).toBe("document");
      });
    });

    it("should filter products by categoryId when provided", async () => {
      // First, get all products to find a valid categoryId
      const allProductsResponse = await request(app)
        .get("/api/products")
        .expect(200);

      const testCategoryId = allProductsResponse.body[0].categoryId;

      // Now filter by that categoryId
      const response = await request(app)
        .get(`/api/products?categoryId=${testCategoryId}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // All products should have the same categoryId
      response.body.forEach((product: any) => {
        expect(product.categoryId).toBe(testCategoryId);
      });
    });

    it("should return all products when categoryId is not provided", async () => {
      const response = await request(app).get("/api/products").expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("CMS to API Flow", () => {
    it("should successfully fetch data from Contentful and return via API", async () => {
      // Test complete data flow: Contentful → Service Layer → API Routes → Response
      const response = await request(app).get("/api/categories").expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);

      // Validates "business user can update page" requirement
      // Any content added in Contentful will appear here
      response.body.forEach((category: any) => {
        expect(category).toHaveProperty("id");
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("order");
      });
    });

    it("should handle real Contentful data with proper content models", async () => {
      const [categories, products] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      expect(categories.length).toBeGreaterThan(0);
      expect(products.length).toBeGreaterThan(0);

      // Validates content model structure matches expected schema
      const category = categories[0];
      expect(category.name).toBeTruthy();
      expect(typeof category.order).toBe("number");

      const product = products[0];
      expect(product.name).toBeTruthy();
      expect(product.categoryId).toBeTruthy();
      expect(product.image).toBeTruthy();
      expect(product.description).toBeTruthy();
    });

    it("should maintain consistent data between direct service calls and API routes", async () => {
      // Get data directly from service
      const directCategories = await getCategories();

      // Get data via API route
      const apiResponse = await request(app).get("/api/categories").expect(200);

      // Both should return the same data
      expect(apiResponse.body).toEqual(directCategories);
    });

    it("should correctly link products to categories", async () => {
      const categories = await getCategories();
      const products = await getProducts();

      expect(categories.length).toBeGreaterThan(0);
      expect(products.length).toBeGreaterThan(0);

      // Every product should have a categoryId that matches an existing category
      const categoryIds = categories.map((cat) => cat.id);

      products.forEach((product) => {
        expect(categoryIds).toContain(product.categoryId);
      });

      // Validates "Display all Products within a Category" requirement
    });
  });

  describe("Cross-platform API validation", () => {
    it("should return JSON suitable for mobile app consumption", async () => {
      const categoriesResponse = await request(app)
        .get("/api/categories")
        .expect(200);

      const productsResponse = await request(app)
        .get("/api/products")
        .expect(200);

      // Validates "accessible by another platform" requirement
      // Both endpoints return clean JSON without Contentful-specific metadata
      expect(categoriesResponse.body[0]).not.toHaveProperty("sys");
      expect(categoriesResponse.body[0]).not.toHaveProperty("fields");
      expect(productsResponse.body[0]).not.toHaveProperty("sys");
      expect(productsResponse.body[0]).not.toHaveProperty("fields");
    });

    it("should serve data suitable for cross-platform consumption", async () => {
      const response = await request(app).get("/api/products").expect(200);

      // Validates "accessible by another platform" requirement
      expect(response.headers["content-type"]).toMatch(/json/);

      // Response should be clean JSON without CMS-specific metadata
      const product = response.body[0];
      expect(product).not.toHaveProperty("sys");
      expect(product).not.toHaveProperty("fields");
      expect(product).not.toHaveProperty("metadata");

      // Data should be ready for mobile app consumption
      expect(product.image).toMatch(/^\/\//); // Protocol-relative URL
      expect(product.description.nodeType).toBe("document"); // Rich text JSON
    });

    it("should handle CORS for cross-platform access", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Origin", "http://localhost:3000")
        .expect(200);

      // CORS headers should be present for frontend access
      expect(response.headers["access-control-allow-origin"]).toBeTruthy();
    });
  });
});
