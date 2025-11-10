import { Product } from "@moneybox/shared-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReactNode } from "react";

interface ProductAccordionProps {
  products: Product[];
  children: (product: Product) => ReactNode;
}

/**
 * ProductAccordion - Renders products in accordion format
 * Takes a render function as children to render the accordion content
 */
export function ProductAccordion({ products, children }: ProductAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={products[0]?.id}
    >
      {products.map((product) => (
        <AccordionItem key={product.id} value={product.id}>
          <AccordionTrigger className="text-base font-semibold">
            {product.name}
          </AccordionTrigger>
          <AccordionContent>
            {children(product)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
