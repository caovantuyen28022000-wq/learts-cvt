import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CheckoutPage: React.FC = () => {
  const { cart, checkout, setPage } = useCart();
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    notes: ''
  });

  const [checkoutResult, setCheckoutResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError("Please fill in all required billing fields.");
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const fullAddress = `${formData.address}, ${formData.city}${formData.zip ? ', ' + formData.zip : ''}`;
    const result = await checkout(fullName, formData.phone, fullAddress);
    if (result.success) {
      setCheckoutResult(result.order);
    } else {
      setError(result.message || "Failed to place order. Please try again.");
    }
  };

  // If order was successfully placed, show Confirmation screen
  if (checkoutResult) {
    return (
      <div className="section section-padding py-5">
        <div className="container">
          <div className="text-center py-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-4">
              <i className="fas fa-check-circle fa-5x text-success"></i>
            </div>
            <h2 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Thank You for Your Order!</h2>
            <p className="text-muted mb-4">
              Your order has been placed successfully. Below are your order details. A confirmation email has been sent to <strong>{formData.email}</strong>.
            </p>
            
            <div className="card text-start mb-4 shadow-sm border-0 bg-light" style={{ borderRadius: '8px' }}>
              <div className="card-body p-4">
                <h5 className="card-title border-bottom pb-2 mb-3">Order summary</h5>
                <p className="mb-2"><strong>Order ID:</strong> <span className="text-primary">{checkoutResult.id}</span></p>
                <p className="mb-2"><strong>Date:</strong> {new Date(checkoutResult.createdAt).toLocaleString()}</p>
                <p className="mb-2"><strong>Ship To:</strong> {formData.firstName} {formData.lastName}</p>
                <p className="mb-3"><strong>Address:</strong> {formData.address}, {formData.city}, {formData.zip}</p>

                <div className="border-top pt-3">
                  <h6 className="mb-2">Items Ordered:</h6>
                  <ul className="list-unstyled">
                    {checkoutResult.items.map((item: any, idx: number) => (
                      <li key={idx} className="d-flex justify-content-between mb-1 small text-muted">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>£{item.subtotal.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-top pt-3 mt-3">
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>Subtotal:</span>
                    <span>£{checkoutResult.subtotal.toFixed(2)}</span>
                  </div>
                  {checkoutResult.discount > 0 && (
                    <div className="d-flex justify-content-between mb-1 small text-success">
                      <span>Discount:</span>
                      <span>-£{checkoutResult.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>Shipping:</span>
                    <span>{checkoutResult.shipping === 0 ? "Free" : `£${checkoutResult.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2 mt-2 font-weight-bold">
                    <strong>Total:</strong>
                    <strong>£{checkoutResult.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <button 
                className="btn btn-dark btn-hover-primary"
                onClick={() => setPage('shop')}
              >
                Continue Shopping
              </button>
              <button 
                className="btn btn-outline-dark"
                onClick={() => setPage('orders')}
              >
                View Orders History
              </button>
            </div>
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
                <h1 className="title">Checkout</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#shop" onClick={(e) => { e.preventDefault(); setPage('shop'); }}>Home</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#cart" onClick={(e) => { e.preventDefault(); setPage('cart'); }}>Cart</a>
                  </li>
                  <li className="breadcrumb-item active">Checkout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="section section-padding">
        <div className="container">
          {cart.items.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Your Cart is Empty</h3>
              <p className="text-muted mb-4">Please add some products to your cart before checking out.</p>
              <button className="btn btn-dark" onClick={() => setPage('shop')}>Back to Shop</button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder}>
              <div className="row g-5">
                {/* Billing Details */}
                <div className="col-lg-7">
                  <h3 className="mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Billing details</h3>
                  
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">First Name <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Street Address <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control mb-2" 
                      placeholder="House number and street name"
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Town / City <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="city" 
                        value={formData.city}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Postcode / ZIP (optional)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="zip" 
                        value={formData.zip}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Phone <span className="text-danger">*</span></label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address <span className="text-danger">*</span></label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Order Notes (optional)</label>
                    <textarea 
                      className="form-control" 
                      rows={4} 
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-5">
                  <div className="cart-totals" style={{ padding: '30px', backgroundColor: '#fcfaf7', borderRadius: '8px' }}>
                    <h3 className="mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Your order</h3>
                    
                    <table className="table border-0 mb-4">
                      <thead>
                        <tr className="border-bottom">
                          <th style={{ backgroundColor: 'transparent', paddingLeft: 0 }}>Product</th>
                          <th className="text-end" style={{ backgroundColor: 'transparent', paddingRight: 0 }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.items.map((item) => (
                          <tr key={item.id} className="border-bottom">
                            <td style={{ backgroundColor: 'transparent', paddingLeft: 0 }} className="text-muted">
                              {item.name} <strong className="text-dark">× {item.quantity}</strong>
                            </td>
                            <td className="text-end" style={{ backgroundColor: 'transparent', paddingRight: 0 }}>
                              £{item.subtotal.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        
                        <tr className="border-bottom">
                          <td style={{ backgroundColor: 'transparent', paddingLeft: 0 }} className="font-weight-bold">Subtotal</td>
                          <td className="text-end" style={{ backgroundColor: 'transparent', paddingRight: 0 }}>
                            £{cart.subtotal.toFixed(2)}
                          </td>
                        </tr>

                        {cart.appliedCoupon && (
                          <tr className="border-bottom text-success">
                            <td style={{ backgroundColor: 'transparent', paddingLeft: 0 }}>
                              Coupon ({cart.appliedCoupon.code})
                            </td>
                            <td className="text-end" style={{ backgroundColor: 'transparent', paddingRight: 0 }}>
                              -£{cart.discount.toFixed(2)}
                            </td>
                          </tr>
                        )}

                        <tr className="border-bottom">
                          <td style={{ backgroundColor: 'transparent', paddingLeft: 0 }}>Shipping</td>
                          <td className="text-end" style={{ backgroundColor: 'transparent', paddingRight: 0 }}>
                            {cart.shipping === 0 ? "Free" : `£${cart.shipping.toFixed(2)}`}
                          </td>
                        </tr>

                        <tr>
                          <td style={{ backgroundColor: 'transparent', paddingLeft: 0 }} className="h5 font-weight-bold">Total</td>
                          <td className="text-end text-dark h5 font-weight-bold" style={{ backgroundColor: 'transparent', paddingRight: 0 }}>
                            <strong>£{cart.total.toFixed(2)}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mb-4 text-muted small p-3 bg-white" style={{ borderLeft: '3px solid #bd9a5f', borderRadius: '4px' }}>
                      Cash on Delivery. Pay with cash upon delivery of your products. Safe and easy!
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-dark btn-outline-hover-dark w-100 py-3"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
