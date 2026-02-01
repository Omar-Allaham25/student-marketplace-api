import { useState } from "react";
import ProductCard from "../components/productCard";
import type { Product } from "../types/product";

const Marketplace = () => {
  const [products] = useState<Product[]>([
    { id: 1, title: "Java Slides", price: 2, category: "slides" },
    { id: 2, title: "Python Book", price: 3, category: "books" },
    { id: 3, title: "DB Book", price: 4, category: "books" },
  ]);

  return (
    <div>
      <h2>Marketplace</h2>

      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Marketplace;
