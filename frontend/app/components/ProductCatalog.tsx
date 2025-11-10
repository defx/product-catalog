"use client";

import { Category, Product } from "@moneybox/shared-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { ProductAccordion } from "./ProductAccordion";
import { ProductItem } from "./ProductItem";

interface ProductCatalogProps {
  categories: Category[];
  products: Product[];
}

/**
 * ProductCatalog component - Server-rendered catalog with category carousel
 * Each slide contains a category card and its products in an accordion
 */
export function ProductCatalog({ categories, products }: ProductCatalogProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <CarouselPrevious className="static translate-y-0 shrink-0" />
        <h2 className="text-xl sm:text-2xl font-semibold whitespace-nowrap">
          Explore Accounts
        </h2>
        <CarouselNext className="static translate-y-0 shrink-0" />
      </div>

      <CarouselContent>
        {categories
          .map((category) => ({
            category,
            products: products.filter(
              (product) => product.categoryId === category.id
            ),
          }))
          .filter(({ products }) => products.length > 0)
          .map(({ category, products: categoryProducts }) => (
            <CarouselItem
              key={category.id}
              className="basis-full lg:basis-1/3 pl-0 pr-px"
            >
              <Card className="px-3 sm:px-4 py-4 sm:py-6 mr-px">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>

                {categoryProducts.length === 1 ? (
                  <ProductItem product={categoryProducts[0]} showTitle />
                ) : (
                  <ProductAccordion products={categoryProducts}>
                    {(product) => <ProductItem product={product} />}
                  </ProductAccordion>
                )}
              </Card>
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  );
}
