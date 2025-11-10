import { Product } from "@moneybox/shared-types";
import Image from "next/image";
import { RichText } from "./RichText";

interface ProductItemProps {
  product: Product;
  showTitle?: boolean;
}

/**
 * ProductItem - Displays product name, image and description
 */
export function ProductItem({ product, showTitle = false }: ProductItemProps) {
  return (
    <div className="space-y-2">
      {showTitle && (
        <h4 className="text-base font-semibold">{product.name}</h4>
      )}
      <div className="flex gap-4">
        {product.image && (
          <div className="flex-shrink-0">
            <Image
              src={`https:${product.image}`}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-lg object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <RichText content={product.description} />
        </div>
      </div>
    </div>
  );
}
