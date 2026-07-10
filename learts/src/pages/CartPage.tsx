import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleQtyChange = async (productId: number, currentQty: number, change: number, stock: number) => {
    const newQty = currentQty + change;
    if (newQty < 1 || newQty > stock) return;
    await updateQuantity(productId, newQty);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponCode.trim()) return;

    const res = await applyCoupon(couponCode);
    if (res.success) {
      setCouponMsg({ text: res.message, success: true });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.message, success: false });
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="section section-padding py-5">
        <div className="container">
          <div className="text-center py-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-4">
              <i className="fas fa-shopping-basket fa-5x text-muted"></i>
            </div>
            <h2 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Your Cart is Empty</h2>
            <p className="text-muted mb-4">
              You have no items in your shopping cart. Browse our catalog to find premium handcrafted decorations, gifts, and tools!
            </p>
            <Link to="/shop" className="btn btn-dark">Shop Our Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Title Section */}
      <div className="page-title-section section" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Giỏ hàng</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                  <li className="breadcrumb-item active">Giỏ hàng</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content Section */}
      <div className="section section-padding bg-light">
        <div className="container">
          <div className="row g-4">
            {/* Cart Items list Table */}
            <div className="col-lg-8 col-12">
              <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
                <div className="table-responsive">
                  <table className="table table-hover align-middle text-start" style={{ minWidth: '600px' }}>
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '100px' }}>Giỏ hàng</th>
                        <th>Sản phẩm</th>
                        <th className="text-end" style={{ width: '120px' }}>Giá</th>
                        <th className="text-center" style={{ width: '140px' }}>Số lượng</th>
                        <th className="text-end" style={{ width: '120px' }}>Tạm tính</th>
                        <th className="text-center" style={{ width: '60px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <Link to={`/product/${item.id}`}>
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            </Link>
                          </td>
                          <td>
                            <Link to={`/product/${item.id}`} className="font-weight-bold text-dark text-decoration-none">
                              {item.name}
                            </Link>
                          </td>
                          <td className="text-end text-dark">
                            £{item.price.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <div className="d-inline-flex align-items-center border rounded">
                              <button 
                                className="btn btn-sm border-0 px-2"
                                onClick={() => handleQtyChange(item.id, item.quantity, -1, item.stock)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-3" style={{ fontWeight: 600 }}>{item.quantity}</span>
                              <button 
                                className="btn btn-sm border-0 px-2"
                                onClick={() => handleQtyChange(item.id, item.quantity, 1, item.stock)}
                                disabled={item.quantity >= item.stock}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-end text-dark font-weight-bold">
                            £{item.subtotal.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <button 
                              className="btn-close" 
                              onClick={() => removeFromCart(item.id)}
                              style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer' }}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Coupon Code Application Form */}
                <div className="row mt-4 pt-3 border-top align-items-center">
                  <div className="col-md-7 col-12 text-start">
                    <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Coupon code (e.g. DISCOUNT10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{ maxWidth: '280px' }}
                      />
                      <button type="submit" className="btn btn-dark">Áp dụng</button>
                    </form>
                    {couponMsg && (
                      <p className={`small mt-2 mb-0 ${couponMsg.success ? 'text-success' : 'text-danger'}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </div>
                  <div className="col-md-5 col-12 text-md-end mt-3 mt-md-0">
                    <Link to="/shop" className="btn btn-outline-dark btn-sm">Tiếp tục mua sắm</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary totals Card */}
            <div className="col-lg-4 col-12">
              <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
                <h3 className="mb-4 text-start" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Cộng giỏ hàng</h3>
                
                <table className="table table-borderless text-start mb-4">
                  <tbody>
                    <tr className="border-bottom">
                      <td className="text-muted py-3">Tạm tính</td>
                      <td className="text-end font-weight-bold py-3 text-dark">£{cart.subtotal.toFixed(2)}</td>
                    </tr>
                    
                    {cart.appliedCoupon && (
                      <tr className="border-bottom">
                        <td className="text-muted py-3">
                          Khuyến mãi <span className="badge bg-success">{cart.appliedCoupon.code}</span>
                          <button 
                            className="btn btn-sm text-danger p-0 ms-2"
                            onClick={removeCoupon}
                            style={{ border: 'none', background: 'transparent', marginLeft: '6px' }}
                          >
                            (Xóa)
                          </button>
                        </td>
                        <td className="text-end text-danger py-3 font-weight-bold">-£{cart.discount.toFixed(2)}</td>
                      </tr>
                    )}

                    <tr className="border-bottom">
                      <td className="text-muted py-3">Giao hàng</td>
                      <td className="text-end py-3 text-dark">
                        {cart.shipping > 0 ? `£${cart.shipping.toFixed(2)}` : <span className="text-success">Miễn phí</span>}
                      </td>
                    </tr>

                    <tr>
                      <td className="h5 font-weight-bold py-3 text-dark">Tổng cộng</td>
                      <td className="text-end h4 font-weight-bold py-3 text-primary">£{cart.total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <button 
                  className="btn btn-dark w-100 py-3 text-uppercase font-weight-bold"
                  onClick={() => navigate('/checkout')}
                  style={{ letterSpacing: '1px', fontSize: '13px' }}
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
