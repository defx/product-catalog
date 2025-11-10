import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryList } from '../CategoryList';
import { Category } from '@moneybox/shared-types';

describe('CategoryList Component', () => {
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'ISAs',
      order: 1,
      description: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Tax-efficient savings accounts',
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
    {
      id: '2',
      name: 'Pensions',
      order: 2,
    },
  ];

  it('should render all categories with names', () => {
    render(<CategoryList categories={mockCategories} />);

    expect(screen.getByText('ISAs')).toBeInTheDocument();
    expect(screen.getByText('Pensions')).toBeInTheDocument();
  });

  it('should render categories heading', () => {
    render(<CategoryList categories={mockCategories} />);

    expect(screen.getByRole('heading', { name: /categories/i })).toBeInTheDocument();
  });

  it('should display descriptions when provided', () => {
    render(<CategoryList categories={mockCategories} />);

    // Validates "description for each product" requirement (also applies to categories)
    expect(screen.getByText(/Tax-efficient savings accounts/i)).toBeInTheDocument();
  });

  it('should handle categories without descriptions', () => {
    render(<CategoryList categories={mockCategories} />);

    // Pensions has no description - should still render the name
    expect(screen.getByText('Pensions')).toBeInTheDocument();
  });

  it('should show empty state when no categories provided', () => {
    render(<CategoryList categories={[]} />);

    expect(screen.getByText(/no categories found/i)).toBeInTheDocument();
  });

  it('should render the correct number of categories', () => {
    const { container } = render(<CategoryList categories={mockCategories} />);

    // Count list items
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(mockCategories.length);
  });

  it('should display categories in a list structure', () => {
    render(<CategoryList categories={mockCategories} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    // Validates "Display all the different Categories" requirement from brief
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(mockCategories.length);
  });
});
