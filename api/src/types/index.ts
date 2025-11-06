export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image: string; // Asset reference or URL
}
