import { Product } from '@moneybox/shared-types';
import Image from 'next/image';
import { RichText } from './RichText';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return <div>No products found</div>;
  }

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            {product.image && (
              <Image
                src={`https:${product.image}`}
                alt={product.name}
                width={100}
                height={100}
                style={{ objectFit: 'contain' }}
              />
            )}
            <RichText content={product.description} />
          </div>
        ))}
      </div>
    </div>
  );
}
