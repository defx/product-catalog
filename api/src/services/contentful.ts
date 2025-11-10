import { createClient, EntrySkeletonType, EntryFieldTypes, Asset } from 'contentful';
import { Category, Product } from '@moneybox/shared-types';

// Contentful entry skeleton types (required by SDK)
interface ContentfulCategorySkeleton extends EntrySkeletonType {
  contentTypeId: 'category';
  fields: {
    name: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.RichText;
    order: EntryFieldTypes.Integer;
  };
}

interface ContentfulProductSkeleton extends EntrySkeletonType {
  contentTypeId: 'product';
  fields: {
    name: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.RichText;
    category: EntryFieldTypes.EntryLink<ContentfulCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
  };
}

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

/**
 * Fetch all categories from Contentful
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await client.getEntries<ContentfulCategorySkeleton>({
      content_type: 'category',
      order: ['fields.order'],
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      description: item.fields.description,
      order: item.fields.order,
    }));
  } catch (error) {
    console.error('Error fetching categories from Contentful:', error);
    throw new Error('Failed to fetch categories');
  }
}

/**
 * Fetch all products from Contentful
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await client.getEntries<ContentfulProductSkeleton>({
      content_type: 'product',
      include: 2, // Include linked entries (category) and assets (image)
    });

    return response.items.map((item) => {
      const image = item.fields.image as Asset;
      const imageUrl = typeof image.fields.file?.url === 'string'
        ? image.fields.file.url
        : '';

      return {
        id: item.sys.id,
        name: item.fields.name,
        description: item.fields.description,
        categoryId: item.fields.category.sys.id,
        image: imageUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching products from Contentful:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Fetch products by category ID
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const response = await client.getEntries<ContentfulProductSkeleton>({
      content_type: 'product',
      'fields.category.sys.id': categoryId,
      include: 2,
    });

    return response.items.map((item) => {
      const image = item.fields.image as Asset;
      const imageUrl = typeof image.fields.file?.url === 'string'
        ? image.fields.file.url
        : '';

      return {
        id: item.sys.id,
        name: item.fields.name,
        description: item.fields.description,
        categoryId: item.fields.category.sys.id,
        image: imageUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching products by category from Contentful:', error);
    throw new Error('Failed to fetch products by category');
  }
}
