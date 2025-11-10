'use client';

import { useState } from 'react';
import { Category, Product } from '@moneybox/shared-types';
import { Carousel } from './Carousel';
import { CategoryCard } from './CategoryCard';
import { ProductList } from './ProductList';

interface ProductCatalogProps {
  categories: Category[];
  products: Product[];
}

/**
 * ProductCatalog component - Manages category selection and product filtering
 */
export function ProductCatalog({ categories, products }: ProductCatalogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filter products by selected category
  const filteredProducts = selectedCategoryId
    ? products.filter((product) => product.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="space-y-8">
      {/* Category Carousel */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
        <Carousel
          items={categories}
          renderItem={(category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={selectedCategoryId === category.id}
              onClick={() => {
                setSelectedCategoryId(
                  selectedCategoryId === category.id ? null : category.id
                );
              }}
            />
          )}
          showArrows={true}
        />
      </section>

      {/* Product List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategoryId
              ? `${categories.find((c) => c.id === selectedCategoryId)?.name} Products`
              : 'All Products'}
          </h2>
          {selectedCategoryId && (
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
        <ProductList products={filteredProducts} />
      </section>
    </div>
  );
}
