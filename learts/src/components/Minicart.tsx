import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const Minicart: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, fetchCart } = useCartStore();

  React.useEffect(() => {
    if (isCartOpen) {
      fetchCart();
    }
  }, [isCartOpen, fetchCart]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(false);
  };

  const handleRemove = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    await removeFromCart(productId);
  };

  return (
    <>
      <div 
        id="offcanvas-cart" 
        className={`offcanvas offcanvas-cart ${isCartOpen ? 'offcanvas-open' : ''}`}
        style={{ 
          visibility: isCartOpen ? 'visible' : 'hidden', 
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s ease, visibility 0.4s ease'
        }}
      >
        <div className="inner">
          <div className="head">
            <span className="title">Giỏ hàng</span>
            <button className="offcanvas-close" onClick={handleClose}>×</button>
          </div>
          
          <div className="body customScroll">
            {cart.items.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-shopping-basket fa-3x mb-3"></i>
                <p>Giỏ hàng của bạn đang trống.</p>
              </div>
            ) : (
              <ul className="minicart-product-list">
                {cart.items.map((item) => (
                  <li key={item.id}>
                    <Link to={`/product/${item.id}`} className="image" onClick={() => setIsCartOpen(false)}>
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <div className="content">
                      <Link to={`/product/${item.id}`} className="title" onClick={() => setIsCartOpen(false)}>
                        {item.name}
                      </Link>
                      <span className="quantity-price">
                        {item.quantity} x <span className="amount">£{item.price.toFixed(2)}</span>
                      </span>
                      <a href="#remove" className="remove" onClick={(e) => handleRemove(e, item.id)}>×</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="foot">
            <div className="sub-total">
              <strong>Tạm tính :</strong>
              <span className="amount">£{cart.subtotal.toFixed(2)}</span>
            </div>

            {cart.subtotal > 0 && (
              <div className="sub-total">
                <strong>Vận chuyển :</strong>
                <span className="amount">
                  {cart.shipping > 0 ? `£${cart.shipping.toFixed(2)}` : 'Miễn phí'}
                </span>
              </div>
            )}
            
            {cart.discount > 0 && (
              <div className="sub-total">
                <strong>Giảm giá :</strong>
                <span className="amount text-danger">-£{cart.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="sub-total border-top pt-2">
              <strong>Tổng cộng :</strong>
              <span className="amount text-primary">£{cart.total.toFixed(2)}</span>
            </div>

            <div className="buttons">
              <Link to="/cart" className="btn btn-dark btn-hover-primary" onClick={() => setIsCartOpen(false)}>
                Xem giỏ hàng
              </Link>
              <Link to="/checkout" className="btn btn-outline-dark" onClick={() => setIsCartOpen(false)}>
                Thanh toán
              </Link>
            </div>
            <p className="minicart-message">Miễn phí vận chuyển cho đơn hàng từ £100!</p>
          </div>
        </div>
      </div>
      
      {/* Overlay backdrop */}
      {isCartOpen && (
        <div 
          className="offcanvas-overlay" 
          onClick={handleClose} 
          style={{ opacity: 1, visibility: 'visible', transition: 'all 0.4s ease' }}
        />
      )}
    </>
  );
};

export default Minicart;
