import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

const AdminOrdersPage: React.FC = () => {
  const { adminUsername, logoutAdmin } = useAuthStore();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states for Editing Order Details
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    status: 'Pending'
  });
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await api.get('/orders');
      if (response && Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response && Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenEdit = (order: any) => {
    setEditingOrder(order);
    setFormData({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      status: order.status
    });
    setFormMsg(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.customerAddress.trim()) {
      setFormMsg("Please enter valid order details.");
      return;
    }

    try {
      await api.put(`/orders/${editingOrder.id}`, formData);
      setIsFormOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (err: any) {
      setFormMsg(err.message || 'Update failed');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete order ${orderId}?`)) {
      try {
        await api.delete(`/orders/${orderId}`);
        fetchOrders();
      } catch (err: any) {
        alert(err.message || "Failed to delete order");
      }
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

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Control Panel Header */}
      <div className="bg-dark text-white py-3 border-bottom border-secondary text-start">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="h4 m-0 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Learts Control Panel</span>
            <span className="badge bg-secondary">Hello, {adminUsername || 'Admin'}</span>
          </div>
          
          <div className="d-flex gap-2 align-items-center">
            <button 
              className="btn btn-sm btn-outline-light"
              onClick={() => navigate('/admin/products')}
            >
              Manage Products
            </button>
            <button 
              className="btn btn-sm btn-outline-light active"
              onClick={() => navigate('/admin/orders')}
            >
              Manage Orders
            </button>
            <button 
              className="btn btn-sm btn-danger ms-3"
              onClick={handleLogout}
              style={{ marginLeft: '15px' }}
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
            <h2 className="m-0 text-dark text-start" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Customer Orders Management</h2>
            <button className="btn btn-light" onClick={fetchOrders}>🔄 Refresh List</button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Edit Order Modal Form */}
          {isFormOpen && (
            <div className="card shadow-sm border-0 p-4 mb-5 bg-white text-start" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                <h4 className="m-0">Edit Order: #{editingOrder?.id}</h4>
                <button 
                  type="button" 
                  className="btn-close" 
                  style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
                  onClick={() => setIsFormOpen(false)}
                >
                  ×
                </button>
              </div>

              {formMsg && (
                <div className="alert alert-warning py-2 mb-3">
                  {formMsg}
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="row g-3">
                  {/* Customer Name */}
                  <div className="col-md-6">
                    <label className="form-label font-weight-bold">Customer Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="customerName" 
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="col-md-6">
                    <label className="form-label font-weight-bold">Phone Number *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="customerPhone" 
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {/* Order Status */}
                  <div className="col-md-12">
                    <label className="form-label font-weight-bold">Order Status *</label>
                    <select 
                      className="form-select" 
                      name="status" 
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '8px 12px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Customer Address */}
                  <div className="col-md-12">
                    <label className="form-label font-weight-bold">Shipping Address *</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      name="customerAddress" 
                      value={formData.customerAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button 
                    type="button" 
                    className="btn btn-light me-2" 
                    style={{ marginRight: '10px' }}
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-dark"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Summary Stats Row */}
          <div className="row g-4 mb-4 text-start">
            {/* Total Orders Card */}
            <div className="col-md-6 col-12">
              <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #bd9a5f' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small text-uppercase font-weight-bold d-block mb-1">Tổng Số Đơn Hàng</span>
                    <span className="h3 m-0 font-weight-bold text-dark">{orders.length}</span>
                  </div>
                  <div className="bg-light p-3 rounded-circle">
                    <i className="fas fa-receipt fa-2x text-muted" style={{ fontSize: '24px' }}></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Revenue Card (excluding Cancelled orders) */}
            <div className="col-md-6 col-12">
              <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px', borderLeft: '4px solid #198754' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small text-uppercase font-weight-bold d-block mb-1">Tổng Doanh Thu (Hợp lệ)</span>
                    <span className="h3 m-0 font-weight-bold text-dark">
                      £{orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-light p-3 rounded-circle">
                    <i className="fas fa-coins fa-2x text-muted" style={{ fontSize: '24px' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
                <p className="mt-3">Loading system orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-receipt fa-3x mb-3"></i>
                <p>No customer orders found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle m-0" style={{ minWidth: '1000px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '130px' }}>Order ID</th>
                      <th>Customer Details</th>
                      <th>Delivery Address</th>
                      <th>Items Purchased</th>
                      <th className="text-end" style={{ width: '120px' }}>Total Price</th>
                      <th className="text-center" style={{ width: '140px' }}>Status</th>
                      <th style={{ width: '150px' }}>Order Date</th>
                      <th className="text-center" style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
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
                              padding: '6px 12px', 
                              border: 'none', 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              textAlign: 'center',
                              width: '125px',
                              display: 'inline-block'
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
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-dark me-2"
                            style={{ marginRight: '8px' }}
                            onClick={() => handleOpenEdit(order)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(order.id)}
                          >
                            Delete
                          </button>
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

export default AdminOrdersPage;
