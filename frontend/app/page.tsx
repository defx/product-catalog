import { fetchCategories, fetchProducts } from './lib/api';
import { ProductCatalog } from './components/ProductCatalog';

export default async function Home() {
  // Fetch data on the server
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Moneybox Product Catalog
        </h1>
        <p className="text-lg text-gray-600">
          Explore our range of financial products
        </p>
      </header>

      <ProductCatalog categories={categories} products={products} />
    </main>
  );
}
