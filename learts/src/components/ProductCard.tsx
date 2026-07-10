import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(product.id, 1);
  };

  return (
    <div className="col">
      <div className="product animate__animated animate__fadeIn">
        <div className="product-thumb">
          <Link to={`/product/${product.id}`} className="image">
            <img src={product.image} alt={product.name} />
            <img className="image-hover " src={product.image} alt={product.name} />
          </Link>
          <a 
            href="#add-to-cart" 
            onClick={handleAddToCart} 
            className="add-to-cart hintT-top" 
            data-hint="Add To Cart"
          >
            <i className="fas fa-shopping-cart"></i>
          </a>
        </div>
        <div className="product-info">
          <h6 className="title">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h6>
          <span className="price">
            £{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
