import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';

const ShopPage: React.FC = () => {
  const { products, addToCart, loading } = useCart();
  const [quantities, setQuantities] = useState<{ [productId: number]: number }>({});

  const handleQtyChange = (productId: number, val: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, val)
    }));
  };

  const getQty = (productId: number) => {
    return quantities[productId] || 1;
  };

  const handleAddToCart = (e: React.FormEvent, product: Product) => {
    e.preventDefault();
    const qty = getQty(product.id);
    addToCart(product.id, qty);
    // Reset quantity
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  if (loading) {
    return (
      <div className="section section-padding text-center">
        <div className="container">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
          <p className="mt-3">Loading catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Title Section */}
      <div className="page-title-section section" data-bg-image="assets/images/bg/page-title-1.webp" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Handmade Shop</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#shop">Home</a></li>
                  <li className="breadcrumb-item active">Shop</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Section Start */}
      <div className="section section-padding bg-light">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2 className="title" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Handcrafted Artifacts</h2>
            <p className="subtitle">Discover our collection of premium, handcrafted products designed for the contemporary home.</p>
          </div>

          <div className="row learts-mb-n40">
            {products.map((product) => (
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12 learts-mb-40" key={product.id}>
                <div 
                  className="product-card" 
                  style={{
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Image */}
                  <div className="image-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
                    <a href="#product-details" onClick={(e) => e.preventDefault()} style={{ display: 'block' }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '280px', objectFit: 'cover' }}
                      />
                    </a>
                  </div>

                  {/* Info */}
                  <div className="content-wrap" style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="title" style={{ fontSize: '16px', margin: '0 0 10px 0', fontWeight: 500 }}>
                        <a href="#product-details" onClick={(e) => e.preventDefault()} style={{ color: '#222', textDecoration: 'none' }}>
                          {product.name}
                        </a>
                      </h3>
                      <p style={{ fontSize: '13px', color: '#666', minHeight: '40px', margin: '0 0 15px 0' }}>
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <div className="price-box" style={{ marginBottom: '15px' }}>
                        <span className="price" style={{ fontSize: '18px', fontWeight: 600, color: '#bd9a5f' }}>
                          £{product.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Add to Cart Form */}
                      <form onSubmit={(e) => handleAddToCart(e, product)}>
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          {/* Quantity */}
                          <div className="product-quantity m-0" style={{ height: '38px', width: '90px' }}>
                            <span 
                              className="qty-btn minus" 
                              onClick={() => handleQtyChange(product.id, getQty(product.id) - 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="ti-minus" />
                            </span>
                            <input 
                              type="text" 
                              className="input-qty" 
                              value={getQty(product.id)}
                              readOnly
                              style={{ width: '30px', textAlign: 'center', border: 'none', background: 'transparent' }}
                            />
                            <span 
                              className="qty-btn plus" 
                              onClick={() => handleQtyChange(product.id, getQty(product.id) + 1)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i className="ti-plus" />
                            </span>
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-dark btn-hover-primary"
                            style={{ height: '38px', padding: '0 15px', fontSize: '12px', textTransform: 'uppercase', flexGrow: 1 }}
                          >
                            Add To Cart
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;
