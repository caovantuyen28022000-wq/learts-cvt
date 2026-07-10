import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../store/useCartStore';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only numbers'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().optional()
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage: React.FC = () => {
  const { cart, checkout, loading, fetchCart } = useCartStore();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      zip: ''
    }
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    setCheckoutError(null);
    const fullName = `${values.firstName} ${values.lastName}`;
    const fullAddress = `${values.address}, ${values.city}${values.zip ? ', ' + values.zip : ''}`;
    
    const result = await checkout(fullName, values.phone, fullAddress, values.email);
    if (result.success) {
      setPlacedOrder(result.order);
    } else {
      setCheckoutError(result.message || "Failed to place order. Please try again.");
    }
  };

  // If checkout has completed successfully, render invoice
  if (placedOrder) {
    return (
      <div className="section section-padding py-5">
        <div className="container">
          <div className="text-center py-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-4">
              <i className="fas fa-check-circle fa-5x text-success"></i>
            </div>
            <h2 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Thank You for Your Order!</h2>
            <p className="text-muted mb-4">
              Your order has been placed successfully and your cart has been cleared. Below are your invoice details.
            </p>
            
            <div className="card text-start mb-4 shadow-sm border-0 bg-light" style={{ borderRadius: '8px' }}>
              <div className="card-body p-4">
                <h5 className="border-bottom pb-2 mb-3 font-weight-bold text-dark text-uppercase" style={{ letterSpacing: '1px' }}>
                  Invoice Summary
                </h5>
                <p className="mb-2 text-dark"><strong>Order ID:</strong> <span className="text-primary">{placedOrder.id}</span></p>
                <p className="mb-2 text-dark"><strong>Recipient:</strong> {placedOrder.customerName}</p>
                <p className="mb-2 text-dark"><strong>Phone Number:</strong> {placedOrder.customerPhone}</p>
                <p className="mb-3 text-dark"><strong>Shipping Address:</strong> {placedOrder.customerAddress}</p>

                <h6 className="font-weight-bold mb-2 text-dark mt-4">Items Ordered:</h6>
                <ul className="list-group list-group-flush mb-4">
                  {placedOrder.items.map((item: any, idx: number) => (
                    <li className="list-group-item bg-transparent px-0 d-flex justify-content-between text-dark" key={idx}>
                      <span>{item.name} <strong>× {item.quantity}</strong></span>
                      <strong>£{item.subtotal.toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between border-top pt-2 text-dark">
                  <span>Subtotal:</span>
                  <span>£{placedOrder.subtotal.toFixed(2)}</span>
                </div>
                {placedOrder.discount > 0 && (
                  <div className="d-flex justify-content-between text-danger">
                    <span>Discount:</span>
                    <span>-£{placedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between text-dark">
                  <span>Shipping:</span>
                  <span>{placedOrder.shipping > 0 ? `£${placedOrder.shipping.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 h5 font-weight-bold text-dark mt-2">
                  <span>Grand Total:</span>
                  <span className="text-primary">£{placedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to="/shop" className="btn btn-dark">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="section section-padding py-5">
        <div className="container text-center">
          <h2 className="mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Your Cart is Empty</h2>
          <p className="text-muted mb-4">Cannot proceed to checkout. Please add items to your cart first.</p>
          <Link to="/shop" className="btn btn-dark">Browse Shop</Link>
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
                <h1 className="title">Checkout Details</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/cart">Cart</Link></li>
                  <li className="breadcrumb-item active">Checkout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="section section-padding bg-light">
        <div className="container">
          {checkoutError && (
            <div className="alert alert-danger mb-4" role="alert">
              {checkoutError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4">
              {/* Billing details form */}
              <div className="col-lg-7 col-12 text-start">
                <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
                  <h3 className="mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Billing Details</h3>
                  
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">First Name *</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        {...register('firstName')} 
                      />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">Last Name *</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        {...register('lastName')} 
                      />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label font-weight-bold">Phone Number (10 digits) *</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        {...register('phone')} 
                        placeholder="e.g. 0912345678"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label font-weight-bold">Email Address *</label>
                      <input 
                        type="email" 
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        {...register('email')} 
                        placeholder="e.g. customer@example.com"
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label font-weight-bold">Street Address *</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        {...register('address')} 
                        placeholder="House number and street name"
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                    </div>

                    <div className="col-sm-8">
                      <label className="form-label font-weight-bold">Town / City *</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        {...register('city')} 
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
                    </div>

                    <div className="col-sm-4">
                      <label className="form-label font-weight-bold">Postcode / ZIP</label>
                      <input 
                        type="text" 
                        className="form-control"
                        {...register('zip')} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Invoice Review Card */}
              <div className="col-lg-5 col-12 text-start">
                <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
                  <h3 className="mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Your Order</h3>
                  
                  <table className="table table-borderless mb-4 align-middle">
                    <thead>
                      <tr className="border-bottom text-muted small">
                        <th>Giỏ hàng</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map((item) => (
                        <tr key={item.id} className="border-bottom">
                          <td className="py-3 text-dark">
                            {item.name} <strong className="text-muted">× {item.quantity}</strong>
                          </td>
                          <td className="text-end py-3 text-dark font-weight-bold">
                            £{item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      
                      <tr className="border-bottom text-muted">
                        <td className="py-3">Subtotal</td>
                        <td className="text-end py-3 text-dark font-weight-bold">£{cart.subtotal.toFixed(2)}</td>
                      </tr>

                      {cart.appliedCoupon && (
                        <tr className="border-bottom text-muted">
                          <td className="py-3">
                            Coupon <span className="badge bg-success">{cart.appliedCoupon.code}</span>
                          </td>
                          <td className="text-end py-3 text-danger font-weight-bold">-£{cart.discount.toFixed(2)}</td>
                        </tr>
                      )}

                      <tr className="border-bottom text-muted">
                        <td className="py-3">Shipping</td>
                        <td className="text-end py-3 text-dark">
                          {cart.shipping > 0 ? `£${cart.shipping.toFixed(2)}` : 'Free Shipping'}
                        </td>
                      </tr>

                      <tr className="h5 text-dark font-weight-bold">
                        <td className="py-3">Total</td>
                        <td className="text-end py-3 text-primary">£{cart.total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Payment selection */}
                  <div className="bg-light p-3 mb-4 rounded border">
                    <div className="form-check text-start">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="cod" 
                        defaultChecked 
                      />
                      <label className="form-check-label font-weight-bold text-dark" htmlFor="cod">
                        Cash on Delivery (COD)
                      </label>
                      <p className="text-muted small mb-0 mt-1">
                        Pay with cash upon delivery. Recommended for test environment transactions.
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-dark w-100 py-3 text-uppercase font-weight-bold"
                    disabled={loading}
                    style={{ letterSpacing: '1px', fontSize: '13px' }}
                  >
                    {loading ? 'Processing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
