import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    applyCoupon, 
    removeCoupon, 
    setPage 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleCouponApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponStatus(null);
    const result = await applyCoupon(couponInput);
    setCouponStatus(result);
    if (result.success) {
      setCouponInput('');
    }
  };

  const handleQtyChange = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQty);
    }
  };

  return (
    <>
      {/* Page Title Section */}
      <div className="page-title-section section" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Cart</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#shop" onClick={(e) => { e.preventDefault(); setPage('shop'); }}>Home</a>
                  </li>
                  <li className="breadcrumb-item active">Cart</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Cart Section */}
      <div className="section section-padding">
        <div className="container">
          {cart.items.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-shopping-cart fa-4x mb-4 text-muted"></i>
              <h2 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Your Cart is Empty</h2>
              <p className="text-muted mb-4">You haven't added any products to your shopping cart yet.</p>
              <button 
                className="btn btn-dark btn-outline-hover-dark"
                onClick={() => setPage('shop')}
              >
                Go to Shop
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items Table */}
              <div className="cart-form">
                <div className="table-responsive">
                  <table className="cart-wishlist-table table">
                    <thead>
                      <tr>
                        <th className="name" colSpan={2}>Product</th>
                        <th className="price">Price</th>
                        <th className="quantity">Quantity</th>
                        <th className="subtotal">Total</th>
                        <th className="remove">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map((item) => (
                        <tr key={item.id}>
                          <td className="thumbnail">
                            <a href="#product" onClick={(e) => e.preventDefault()}>
                              <img src={item.image} alt={item.name} />
                            </a>
                          </td>
                          <td className="name">
                            <a href="#product" onClick={(e) => e.preventDefault()}>{item.name}</a>
                          </td>
                          <td className="price">
                            <span>£{item.price.toFixed(2)}</span>
                          </td>
                          <td className="quantity">
                            <div className="product-quantity">
                              <span 
                                className="qty-btn minus"
                                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                              >
                                <i className="ti-minus" />
                              </span>
                              <input 
                                type="text" 
                                className="input-qty" 
                                value={item.quantity}
                                readOnly
                              />
                              <span 
                                className="qty-btn plus"
                                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                              >
                                <i className="ti-plus" />
                              </span>
                            </div>
                          </td>
                          <td className="subtotal">
                            <span>£{item.subtotal.toFixed(2)}</span>
                          </td>
                          <td className="remove">
                            <button 
                              className="btn btn-link text-decoration-none text-dark" 
                              onClick={() => removeFromCart(item.id)}
                              style={{ fontSize: '24px', padding: 0 }}
                              title="Remove item"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Actions: Coupon & Navigation */}
                <div className="row justify-content-between align-items-center mb-n3 mt-4">
                  <div className="col-auto mb-3">
                    <form className="cart-coupon" onSubmit={handleCouponApply}>
                      <input 
                        type="text" 
                        placeholder="Enter coupon (e.g. DISCOUNT10)" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                      />
                      <button type="submit" className="btn" title="Apply Coupon">
                        <i className="fas fa-gift" />
                      </button>
                    </form>
                    
                    {couponStatus && (
                      <div className={`mt-2 small ${couponStatus.success ? 'text-success' : 'text-danger'}`}>
                        {couponStatus.message}
                      </div>
                    )}
                    
                    <div className="small text-muted mt-1">
                      💡 Available: <strong>DISCOUNT10</strong> (10% off), <strong>DISCOUNT20</strong> (20% off), <strong>WELCOME50</strong> (£50 off), <strong>FREESHIP</strong> (Free Shipping)
                    </div>
                  </div>
                  
                  <div className="col-auto">
                    <button 
                      className="btn btn-light btn-hover-dark mr-3 mb-3"
                      onClick={() => setPage('shop')}
                      style={{ marginRight: '15px' }}
                    >
                      Continue Shopping
                    </button>
                    <button 
                      className="btn btn-dark btn-outline-hover-dark mb-3"
                      onClick={() => setPage('cart')} // Refreshes state
                    >
                      Update Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Totals */}
              <div className="row mt-5 justify-content-end">
                <div className="col-lg-5 col-md-6 col-12">
                  <div className="cart-totals">
                    <h2 className="title">Cart totals</h2>
                    <table>
                      <tbody>
                        <tr className="subtotal">
                          <th>Subtotal</th>
                          <td><span className="amount">£{cart.subtotal.toFixed(2)}</span></td>
                        </tr>
                        
                        {cart.appliedCoupon && (
                          <tr className="coupon">
                            <th>
                              Coupon: <strong className="text-success">{cart.appliedCoupon.code}</strong>
                            </th>
                            <td>
                              <span className="amount text-success">-£{cart.discount.toFixed(2)}</span>
                              <button 
                                onClick={removeCoupon} 
                                className="btn btn-link text-danger p-0 border-0 ms-2"
                                style={{ verticalAlign: 'middle', textDecoration: 'none' }}
                                title="Remove coupon"
                              >
                                (Remove)
                              </button>
                            </td>
                          </tr>
                        )}

                        <tr className="shipping">
                          <th>Shipping</th>
                          <td>
                            <span className="amount">
                              {cart.shipping === 0 ? (
                                <strong className="text-success">Free Shipping</strong>
                              ) : (
                                `£${cart.shipping.toFixed(2)}`
                              )}
                            </span>
                          </td>
                        </tr>

                        <tr className="total">
                          <th>Total</th>
                          <td><strong><span className="amount">£{cart.total.toFixed(2)}</span></strong></td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <button 
                      onClick={() => setPage('checkout')}
                      className="btn btn-dark btn-outline-hover-dark w-100 mt-4 py-3"
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
