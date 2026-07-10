import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch public orders from backend
      const response: any = await api.get('/orders');
      if (response && Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response && Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'Processing':
        return 'bg-primary';
      case 'Cancelled':
        return 'bg-danger';
      case 'Pending':
      default:
        return 'bg-warning text-dark';
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
                <h1 className="title">Orders History</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
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
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
            <h3 className="mb-4 text-start" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Your Purchases</h3>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
                <p className="mt-3 text-muted">Loading purchase history...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-receipt fa-3x mb-3"></i>
                <p className="mb-4">You have not placed any orders yet.</p>
                <Link to="/shop" className="btn btn-dark btn-sm">Shop Catalog</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle text-start" style={{ minWidth: '700px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '130px' }}>Order ID</th>
                      <th>Items purchased</th>
                      <th className="text-end" style={{ width: '120px' }}>Total Price</th>
                      <th className="text-center" style={{ width: '120px' }}>Status</th>
                      <th style={{ width: '180px' }}>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td>
                          <ul className="list-unstyled mb-0 small text-muted">
                            {order.items.map((item: any, idx: number) => (
                              <li key={idx} className="mb-1">
                                • {item.name} <strong className="text-dark">× {item.quantity}</strong>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="text-end text-dark font-weight-bold">
                          £{order.total.toFixed(2)}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${getStatusBadge(order.status)}`} style={{ padding: '6px 10px' }}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className="small text-muted">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
