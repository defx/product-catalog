import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCatalog } from '../ProductCatalog';
import { Category, Product } from '@moneybox/shared-types';
import { BLOCKS, Document } from '@contentful/rich-text-types';

// Mock the Carousel component
vi.mock('../Carousel', () => ({
  Carousel: ({ items, renderItem }: any) => (
    <div data-testid="carousel">
      {items.map((item: any, index: number) => (
        <div key={item.id}>{renderItem(item, index)}</div>
      ))}
    </div>
  ),
}));

describe('ProductCatalog', () => {
  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'ISAs',
      order: 1,
    },
    {
      id: 'cat-2',
      name: 'Pensions',
      order: 2,
    },
  ];

  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Stocks & Shares ISA',
      categoryId: 'cat-1',
      description: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [],
      } as Document,
      image: 'https://example.com/isa.jpg',
    },
    {
      id: 'prod-2',
      name: 'Lifetime ISA',
      categoryId: 'cat-1',
      description: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [],
      } as Document,
      image: 'https://example.com/lisa.jpg',
    },
    {
      id: 'prod-3',
      name: 'Personal Pension',
      categoryId: 'cat-2',
      description: {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [],
      } as Document,
      image: 'https://example.com/pension.jpg',
    },
  ];

  it('renders category carousel', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('renders all products by default', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    expect(screen.getByText('All Products')).toBeInTheDocument();
  });

  it('filters products when category is selected', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    // Click on ISAs category card
    const isaButton = screen.getByRole('button', { name: /ISAs/i });
    fireEvent.click(isaButton);

    // Should show filtered header
    expect(screen.getByText('ISAs Products')).toBeInTheDocument();
  });

  it('shows clear filter button when category is selected', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    // Initially no clear button
    expect(screen.queryByText('Clear filter')).not.toBeInTheDocument();

    // Click on a category
    const isaButton = screen.getByRole('button', { name: /ISAs/i });
    fireEvent.click(isaButton);

    // Clear button should appear
    expect(screen.getByText('Clear filter')).toBeInTheDocument();
  });

  it('clears filter when clear button is clicked', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    // Select a category
    const isaButton = screen.getByRole('button', { name: /ISAs/i });
    fireEvent.click(isaButton);

    expect(screen.getByText('ISAs Products')).toBeInTheDocument();

    // Click clear filter
    const clearButton = screen.getByText('Clear filter');
    fireEvent.click(clearButton);

    // Should be back to all products
    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.queryByText('Clear filter')).not.toBeInTheDocument();
  });

  it('toggles category selection when clicking same category twice', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    const isaButton = screen.getByRole('button', { name: /ISAs/i });

    // Click once to select
    fireEvent.click(isaButton);
    expect(screen.getByText('ISAs Products')).toBeInTheDocument();

    // Click again to deselect
    fireEvent.click(isaButton);
    expect(screen.getByText('All Products')).toBeInTheDocument();
  });

  it('renders category cards with correct active state', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    const isaButton = screen.getByRole('button', { name: /ISAs/i });

    // Initially not active
    expect(isaButton).toHaveAttribute('aria-pressed', 'false');

    // Click to activate
    fireEvent.click(isaButton);
    expect(isaButton).toHaveAttribute('aria-pressed', 'true');
  });
});
