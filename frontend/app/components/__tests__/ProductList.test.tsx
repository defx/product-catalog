import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductList } from "../ProductList";
import { Product } from "@moneybox/shared-types";

describe("ProductList Component", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Cash ISA",
      categoryId: "cat-1",
      image: "//images.ctfassets.net/test/cash-isa.png",
      description: {
        nodeType: "document",
        data: {},
        content: [
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "Tax-free savings account",
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
    {
      id: "2",
      name: "Stocks & Shares ISA",
      categoryId: "cat-1",
      image: "//images.ctfassets.net/test/stocks-shares-isa.png",
      description: {
        nodeType: "document",
        data: {},
        content: [
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "Invest tax-free in stocks and shares",
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
  ];

  it("should render all products with names", () => {
    render(<ProductList products={mockProducts} />);

    expect(screen.getByText("Cash ISA")).toBeInTheDocument();
    expect(screen.getByText("Stocks & Shares ISA")).toBeInTheDocument();
  });

  it("should render products heading", () => {
    render(<ProductList products={mockProducts} />);

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should display product images with correct URLs", () => {
    render(<ProductList products={mockProducts} />);

    // Validates "Show an Image" requirement from brief
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(mockProducts.length);

    // Check that images have valid URLs pointing to Contentful CDN
    const firstImage = images[0] as HTMLImageElement;
    expect(firstImage.src).toMatch(/^https?:\/\/.+/); // ensures a valid URL
    expect(firstImage.src).toContain("ctfassets.net"); // ensures Contentful CDN
  });

  it("should display product images with correct alt text", () => {
    render(<ProductList products={mockProducts} />);

    expect(screen.getByAltText("Cash ISA")).toBeInTheDocument();
    expect(screen.getByAltText("Stocks & Shares ISA")).toBeInTheDocument();
  });

  it("should display product descriptions", () => {
    render(<ProductList products={mockProducts} />);

    // Validates "Show Description" requirement from brief
    expect(screen.getByText(/Tax-free savings account/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Invest tax-free in stocks and shares/i)
    ).toBeInTheDocument();
  });

  it("should render product names as headings", () => {
    render(<ProductList products={mockProducts} />);

    expect(
      screen.getByRole("heading", { name: "Cash ISA" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Stocks & Shares ISA" })
    ).toBeInTheDocument();
  });

  it("should show empty state when no products provided", () => {
    render(<ProductList products={[]} />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("should render the correct number of products", () => {
    const { container } = render(<ProductList products={mockProducts} />);

    // Count product containers (divs with product data)
    const productHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(productHeadings).toHaveLength(mockProducts.length);
  });

  it("should render valid image URLs from Contentful CDN", () => {
    const { container } = render(<ProductList products={mockProducts} />);

    // Validates images are served from Contentful CDN with valid URLs
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      expect(img.src).toMatch(/^https?:\/\/.+/); // ensures a valid URL
      expect(img.src).toContain("ctfassets.net"); // ensures Contentful CDN
    });
  });

  it("should render products with both images and descriptions (brief requirements)", () => {
    render(<ProductList products={mockProducts} />);

    mockProducts.forEach((product) => {
      // Each product should have both image and description visible
      expect(screen.getByAltText(product.name)).toBeInTheDocument();

      // Check description content is rendered (extract text from rich text)
      const descriptionText = product.description.content[0].content[0].value;
      expect(screen.getByText(descriptionText)).toBeInTheDocument();
    });
  });
});
