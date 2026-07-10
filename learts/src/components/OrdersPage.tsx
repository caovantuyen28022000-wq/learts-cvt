import React from 'react';
import { useCart } from '../context/CartContext';

const OrdersPage: React.FC = () => {
  const { orders, setPage } = useCart();

  return (
    <>
      {/* Page Title Section */}
      <div className="page-title-section section" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">My Orders</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#shop" onClick={(e) => { e.preventDefault(); setPage('shop'); }}>Home</a>
                  </li>
                  <li className="breadcrumb-item active">Orders</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="section section-padding bg-light">
        <div className="container">
          {orders.length === 0 ? (
            <div className="text-center py-5 bg-white shadow-sm p-5" style={{ borderRadius: '8px' }}>
              <i className="fas fa-history fa-4x mb-4 text-muted"></i>
              <h2 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>No Orders Found</h2>
              <p className="text-muted mb-4">You haven't placed any orders yet. Explore our handcrafted collection and start shopping today!</p>
              <button 
                className="btn btn-dark btn-outline-hover-dark"
                onClick={() => setPage('shop')}
              >
                Go to Shop
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h3 className="mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Your Order History ({orders.length})</h3>
              
              <div className="d-flex flex-column gap-4">
                {orders.map((order) => (
                  <div className="card shadow-sm border-0 mb-4 bg-white" style={{ borderRadius: '8px', overflow: 'hidden' }} key={order.id}>
                    <div className="card-header bg-dark text-white p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                      <div>
                        <span className="small text-white-50">Order ID: </span>
                        <strong className="text-white">{order.id}</strong>
                      </div>
                      <div className="text-end">
                        <span className="small text-white-50">Placed on: </span>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="card-body p-4">
                      <div className="row g-4">
                        <div className="col-md-7">
                          <h6 className="mb-3 text-muted border-bottom pb-2">Items Bought</h6>
                          <div className="table-responsive">
                            <table className="table table-sm table-borderless m-0">
                              <tbody>
                                {order.items.map((item: any, idx: number) => (
                                  <tr key={idx} style={{ verticalAlign: 'middle' }}>
                                    <td className="ps-0 py-2">
                                      {item.name} <strong className="text-dark">× {item.quantity}</strong>
                                    </td>
                                    <td className="text-end pe-0 py-2 text-muted">
                                      £{item.subtotal.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="col-md-5 border-start-md">
                          <div className="p-3 bg-light" style={{ borderRadius: '6px' }}>
                            <h6 className="mb-3 border-bottom pb-2 text-dark">Order Invoice Summary</h6>
                            <div className="d-flex justify-content-between mb-1 small text-muted">
                              <span>Subtotal:</span>
                              <span>£{order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="d-flex justify-content-between mb-1 small text-success">
                                <span>Discount {order.coupon ? `(${order.coupon})` : ''}:</span>
                                <span>-£{order.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="d-flex justify-content-between mb-2 small text-muted">
                              <span>Shipping:</span>
                              <span>{order.shipping === 0 ? "Free" : `£${order.shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="d-flex justify-content-between border-top pt-2 mt-2 font-weight-bold">
                              <strong>Grand Total:</strong>
                              <strong className="text-primary" style={{ fontSize: '18px' }}>£{order.total.toFixed(2)}</strong>
                            </div>
                            
                            <div className="mt-3 pt-2 border-top d-flex align-items-center justify-content-between">
                              <span className="small text-muted">Status:</span>
                              <span className="badge bg-success" style={{ padding: '6px 12px', fontSize: '11px', textTransform: 'uppercase' }}>
                                Processing
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
