import { Category } from '@moneybox/shared-types';
import { RichText } from './RichText';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return <div>No categories found</div>;
  }

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>
            {category.description && <RichText content={category.description} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
