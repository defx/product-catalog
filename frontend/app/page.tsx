import { fetchCategories, fetchProducts } from "./lib/api";
import { ProductCatalog } from "./components/ProductCatalog";

export default async function Home() {
  // Fetch data on the server
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return (
    <main className="mx-auto max-w-7xl">
      <header className="mb-4 sm:mb-8 mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Moneybox
        </h1>
      </header>

      <ProductCatalog categories={categories} products={products} />
    </main>
  );
}
