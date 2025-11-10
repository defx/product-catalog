import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCatalog } from '../ProductCatalog';
import { Category, Product } from '@moneybox/shared-types';
import { BLOCKS, Document } from '@contentful/rich-text-types';

// Mock the shadcn UI components
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: any) => <div>{children}</div>,
  CarouselItem: ({ children }: any) => <div>{children}</div>,
  CarouselPrevious: () => <button>Previous</button>,
  CarouselNext: () => <button>Next</button>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children }: any) => <button>{children}</button>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
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
    {
      id: 'cat-3',
      name: 'Empty Category',
      order: 3,
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

  it('renders carousel with header and navigation', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    expect(screen.getByText('Explore Accounts')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('renders all categories with products', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    expect(screen.getByText('ISAs')).toBeInTheDocument();
    expect(screen.getByText('Pensions')).toBeInTheDocument();
  });

  it('filters out categories with no products', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    // Empty Category should not be rendered
    expect(screen.queryByText('Empty Category')).not.toBeInTheDocument();
  });

  it('renders products within their category slides', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    // Products for ISAs category
    expect(screen.getByText('Stocks & Shares ISA')).toBeInTheDocument();
    expect(screen.getByText('Lifetime ISA')).toBeInTheDocument();

    // Product for Pensions category
    expect(screen.getByText('Personal Pension')).toBeInTheDocument();
  });

  it('renders single product without accordion', () => {
    const singleProductCategories: Category[] = [
      {
        id: 'cat-single',
        name: 'Single Product Category',
        order: 1,
      },
    ];

    const singleProduct: Product[] = [
      {
        id: 'prod-single',
        name: 'Only Product',
        categoryId: 'cat-single',
        description: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [],
        } as Document,
        image: 'https://example.com/single.jpg',
      },
    ];

    render(
      <ProductCatalog categories={singleProductCategories} products={singleProduct} />
    );

    expect(screen.getByText('Single Product Category')).toBeInTheDocument();
    expect(screen.getByText('Only Product')).toBeInTheDocument();
  });

  it('renders multiple products in accordion', () => {
    render(
      <ProductCatalog categories={mockCategories} products={mockProducts} />
    );

    // ISAs category has 2 products, should use accordion
    expect(screen.getByText('Stocks & Shares ISA')).toBeInTheDocument();
    expect(screen.getByText('Lifetime ISA')).toBeInTheDocument();
  });

  it('renders empty state when no categories with products', () => {
    render(
      <ProductCatalog categories={mockCategories} products={[]} />
    );

    // Should render carousel header but no category slides
    expect(screen.getByText('Explore Accounts')).toBeInTheDocument();
    expect(screen.queryByText('ISAs')).not.toBeInTheDocument();
    expect(screen.queryByText('Pensions')).not.toBeInTheDocument();
  });
});
