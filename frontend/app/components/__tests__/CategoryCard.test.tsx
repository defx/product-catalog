import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryCard } from '../CategoryCard';
import { Category } from '@moneybox/shared-types';
import { BLOCKS, Document } from '@contentful/rich-text-types';

describe('CategoryCard', () => {
  const mockCategory: Category = {
    id: '1',
    name: 'ISAs',
    description: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Tax-free savings accounts',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    } as Document,
    order: 1,
  };

  const mockCategoryWithoutDescription: Category = {
    id: '2',
    name: 'Pensions',
    order: 2,
  };

  it('renders category name', () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText('ISAs')).toBeInTheDocument();
  });

  it('renders category description when provided', () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText('Tax-free savings accounts')).toBeInTheDocument();
  });

  it('does not render description paragraph when description is missing', () => {
    render(<CategoryCard category={mockCategoryWithoutDescription} />);
    expect(screen.queryByText(/Tax-free/)).not.toBeInTheDocument();
  });

  it('applies active styles when isActive is true', () => {
    const { container } = render(
      <CategoryCard category={mockCategory} isActive={true} />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('border-blue-500');
    expect(button?.className).toContain('bg-blue-50');
  });

  it('applies inactive styles when isActive is false', () => {
    const { container } = render(
      <CategoryCard category={mockCategory} isActive={false} />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('border-gray-200');
    expect(button?.className).toContain('bg-white');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <CategoryCard category={mockCategory} onClick={handleClick} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets aria-pressed attribute based on isActive prop', () => {
    const { rerender } = render(
      <CategoryCard category={mockCategory} isActive={false} />
    );

    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(<CategoryCard category={mockCategory} isActive={true} />);

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders as a button element', () => {
    render(<CategoryCard category={mockCategory} />);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });
});
