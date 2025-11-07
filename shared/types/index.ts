import { Document } from '@contentful/rich-text-types';

export interface Category {
  id: string;
  name: string;
  description?: Document;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: Document;
  categoryId: string;
  image: string; // Asset reference or URL
}
