import { CategoryList } from './components/CategoryList';
import { ProductList } from './components/ProductList';
import { fetchCategories, fetchProducts } from './lib/api';

export default async function Home() {
  // Fetch data on the server
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Moneybox Product Catalog</h1>
      <p>Explore our range of financial products</p>

      <div style={{ marginTop: '2rem' }}>
        <CategoryList categories={categories} />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <ProductList products={products} />
      </div>
    </main>
  );
}
