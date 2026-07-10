import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  categoryId: number;
  category_id?: number;
}

interface Category {
  id: number;
  name: string;
}

const AdminProductsPage: React.FC = () => {
  const { adminUsername, logoutAdmin } = useAuthStore();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    categoryId: ''
  });

  const [formMsg, setFormMsg] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get categories
      const catRes: any = await api.get('/categories');
      setCategories(catRes.data);

      // Get products (large limit to show all in dashboard)
      const prodRes: any = await api.get('/products?page=1&limit=100');
      
      const normalizedProducts = prodRes.data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        image: p.image,
        description: p.description || '',
        stock: p.stock || 0,
        categoryId: p.category_id !== undefined ? p.category_id : p.categoryId
      }));
      setProducts(normalizedProducts);

      // Default category id for forms
      if (catRes.data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: String(catRes.data[0].id) }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      stock: '',
      categoryId: categories.length > 0 ? String(categories[0].id) : ''
    });
    setFormMsg(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      image: product.image,
      stock: String(product.stock),
      categoryId: String(product.categoryId)
    });
    setFormMsg(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);
    const catIdNum = parseInt(formData.categoryId);

    if (!formData.name || isNaN(priceNum) || !formData.image || isNaN(stockNum) || isNaN(catIdNum)) {
      setFormMsg("Please enter valid product details.");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: priceNum,
      image: formData.image,
      stock: stockNum,
      categoryId: catIdNum
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      fetchDashboardData();
    } catch (err: any) {
      setFormMsg(err.message || 'Action failed');
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`);
        fetchDashboardData();
      } catch (err: any) {
        alert(err.message || "Failed to delete product");
      }
    }
  };

  const getCategoryName = (catId: number) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : `Unassigned (ID: ${catId})`;
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
              className="btn btn-sm btn-outline-light active"
              onClick={() => navigate('/admin/products')}
            >
              Manage Products
            </button>
            <button 
              className="btn btn-sm btn-outline-light"
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
            <h2 className="m-0 text-dark text-start" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Product Inventory</h2>
            <button 
              className="btn btn-dark"
              onClick={handleOpenCreate}
            >
              + Add New Product
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Form Sliding Section */}
          {isFormOpen && (
            <div className="card shadow-sm border-0 p-4 mb-5 bg-white" style={{ borderRadius: '8px' }}>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                <h4 className="m-0">{editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}</h4>
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
                  {/* Name */}
                  <div className="col-md-6 text-start">
                    <label className="form-label font-weight-bold">Product Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {/* Price */}
                  <div className="col-md-3 text-start">
                    <label className="form-label font-weight-bold">Price (GBP) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      name="price" 
                      value={formData.price}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {/* Stock */}
                  <div className="col-md-3 text-start">
                    <label className="form-label font-weight-bold">Stock Quantity *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="stock" 
                      value={formData.stock}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="col-md-6 text-start">
                    <label className="form-label font-weight-bold">Category *</label>
                    <select 
                      className="form-select" 
                      name="categoryId" 
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      style={{ padding: '8px 12px' }}
                    >
                      {categories.map((c) => (
                        <option value={c.id} key={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image URL */}
                  <div className="col-md-6 text-start">
                    <label className="form-label font-weight-bold">Image URL *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="image" 
                      value={formData.image}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  {/* Description */}
                  <div className="col-12 text-start">
                    <label className="form-label font-weight-bold">Description (Optional)</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      name="description" 
                      value={formData.description}
                      onChange={handleInputChange}
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
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '8px' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>
                <p className="mt-3">Loading product inventory...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-boxes fa-3x mb-3"></i>
                <p>No products found in catalog.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle m-0" style={{ minWidth: '800px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '100px' }}>Image</th>
                      <th className="text-start">Product Name</th>
                      <th className="text-start">Category</th>
                      <th className="text-end" style={{ width: '120px' }}>Price</th>
                      <th className="text-center" style={{ width: '120px' }}>Stock</th>
                      <th className="text-center" style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td><strong>#{product.id}</strong></td>
                        <td>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td className="text-start">
                          <span className="font-weight-bold text-dark">{product.name}</span>
                          <p className="small text-muted mb-0 text-truncate" style={{ maxWidth: '300px' }}>
                            {product.description}
                          </p>
                        </td>
                        <td className="text-start">
                          <span className="badge bg-info text-dark">{getCategoryName(product.categoryId)}</span>
                        </td>
                        <td className="text-end font-weight-bold text-dark">
                          £{product.price.toFixed(2)}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${product.stock <= 5 ? 'bg-danger' : 'bg-success'}`} style={{ padding: '6px 10px' }}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-dark me-2"
                            style={{ marginRight: '8px' }}
                            onClick={() => handleOpenEdit(product)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product.id)}
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

export default AdminProductsPage;
