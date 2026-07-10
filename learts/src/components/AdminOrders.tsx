import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const AdminOrders: React.FC = () => {
  const { 
    adminOrders, 
    fetchAdminOrders, 
    updateOrderStatus, 
    logoutAdmin,
    setPage,
    adminUsername,
    loading,
    error 
  } = useCart();

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (!success) {
      alert("Failed to update status. Check backend connection.");
    }
  };

  const getStatusBadgeClass = (status: string) => {
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
      {/* Admin Dashboard Control Panel Header */}
      <div className="bg-dark text-white py-3 border-bottom border-secondary">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="h4 m-0 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Learts Control Panel</span>
            <span className="badge bg-secondary">Hello, {adminUsername || 'Admin'}</span>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-light"
              onClick={() => setPage('admin-products')}
            >
              Manage Products
            </button>
            <button 
              className="btn btn-sm btn-outline-light active"
              onClick={() => setPage('admin-orders')}
            >
              Manage Orders
            </button>
            <button 
              className="btn btn-sm btn-danger ms-3"
              onClick={logoutAdmin}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="section section-padding bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Customer Orders Management</h2>
            <button className="btn btn-light" onClick={fetchAdminOrders}>🔄 Refresh List</button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Orders Table Card */}
          <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
                <p className="mt-3">Loading system orders...</p>
              </div>
            ) : adminOrders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-receipt fa-3x mb-3"></i>
                <p>No customer orders have been placed yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle m-0" style={{ minWidth: '950px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '130px' }}>Order ID</th>
                      <th>Customer Details</th>
                      <th>Delivery Address</th>
                      <th>Items Purchased</th>
                      <th className="text-end" style={{ width: '120px' }}>Total Price</th>
                      <th className="text-center" style={{ width: '160px' }}>Status</th>
                      <th style={{ width: '150px' }}>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="font-weight-bold text-dark">{order.id}</span>
                        </td>
                        <td className="text-start">
                          <span className="font-weight-bold text-dark d-block">{order.customerName}</span>
                          <span className="small text-muted">{order.customerPhone}</span>
                        </td>
                        <td className="text-start">
                          <span className="small text-muted d-block" style={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                            {order.customerAddress}
                          </span>
                        </td>
                        <td className="text-start">
                          <ul className="list-unstyled mb-0 small text-muted">
                            {order.items.map((item: any, idx: number) => (
                              <li key={idx} className="mb-1">
                                • {item.name} <strong className="text-dark">× {item.quantity}</strong>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="text-end font-weight-bold text-dark">
                          £{order.total.toFixed(2)}
                        </td>
                        <td className="text-center">
                          <select 
                            className={`form-select form-select-sm text-white ${getStatusBadgeClass(order.status)}`}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{ 
                              padding: '5px 10px', 
                              border: 'none', 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              textAlign: 'center'
                            }}
                          >
                            <option value="Pending" className="text-dark bg-white">Pending</option>
                            <option value="Processing" className="text-white bg-primary">Processing</option>
                            <option value="Completed" className="text-white bg-success">Completed</option>
                            <option value="Cancelled" className="text-white bg-danger">Cancelled</option>
                          </select>
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

export default AdminOrders;
