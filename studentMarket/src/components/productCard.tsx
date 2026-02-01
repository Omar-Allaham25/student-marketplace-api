import type { Product } from "../types/product";

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  return (
    <div>
      <h3>{product.title}</h3>
      <p>price:{product.price} </p>
      <p>category : {product.category}</p>
    </div>
  );
};

export default ProductCard;
