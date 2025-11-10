import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Carousel } from '../Carousel';

// Mock embla-carousel-react
vi.mock('embla-carousel-react', () => ({
  default: () => {
    const emblaApi = {
      canScrollPrev: () => false,
      canScrollNext: () => true,
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    return [vi.fn(), emblaApi];
  },
}));

describe('Carousel', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];

  const mockRenderItem = (item: typeof mockItems[0]) => (
    <div data-testid={`item-${item.id}`}>{item.name}</div>
  );

  it('renders all items using the renderItem function', () => {
    render(
      <Carousel
        items={mockItems}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
  });

  it('renders navigation arrows by default', () => {
    render(
      <Carousel
        items={mockItems}
        renderItem={mockRenderItem}
      />
    );

    expect(screen.getByLabelText('Previous')).toBeInTheDocument();
    expect(screen.getByLabelText('Next')).toBeInTheDocument();
  });

  it('hides navigation arrows when showArrows is false', () => {
    render(
      <Carousel
        items={mockItems}
        renderItem={mockRenderItem}
        showArrows={false}
      />
    );

    expect(screen.queryByLabelText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next')).not.toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const { container } = render(
      <Carousel
        items={mockItems}
        renderItem={mockRenderItem}
        className="custom-class"
      />
    );

    const carouselContainer = container.querySelector('.custom-class');
    expect(carouselContainer).toBeInTheDocument();
  });

  it('applies itemClassName to item containers', () => {
    const { container } = render(
      <Carousel
        items={mockItems}
        renderItem={mockRenderItem}
        itemClassName="item-custom-class"
      />
    );

    const itemContainers = container.querySelectorAll('.item-custom-class');
    expect(itemContainers).toHaveLength(mockItems.length);
  });

  it('renders empty carousel when items array is empty', () => {
    const { container } = render(
      <Carousel
        items={[]}
        renderItem={mockRenderItem}
      />
    );

    const itemContainers = container.querySelectorAll('[data-testid^="item-"]');
    expect(itemContainers).toHaveLength(0);
  });
});
