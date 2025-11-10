import { Category } from '@moneybox/shared-types';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

interface CategoryCardProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * CategoryCard component for displaying category information in the carousel
 */
export function CategoryCard({ category, isActive = false, onClick }: CategoryCardProps) {
  // Extract plain text from rich text for card preview
  const descriptionText = category.description
    ? documentToPlainTextString(category.description)
    : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-48 p-6 rounded-lg border-2 transition-all duration-200 text-left
        ${isActive
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
      aria-pressed={isActive}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {category.name}
      </h3>
      {descriptionText && (
        <p className="text-sm text-gray-600 line-clamp-2">
          {descriptionText}
        </p>
      )}
    </button>
  );
}
