import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetailQuery } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const productIdNum = Number(productId);

  const { data: productDetail, isLoading, error } = useProductDetailQuery(productIdNum);
  const addToCart = useCartStore(state => state.addToCart);

  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState(false);

  const product = productDetail?.data;

  const handleQuantityChange = (type: 'plus' | 'minus') => {
    if (!product) return;
    if (type === 'minus') {
      setQuantity(prev => Math.max(1, prev - 1));
    } else {
      setQuantity(prev => Math.min(product.stock, prev + 1));
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const success = await addToCart(product.id, quantity);
    if (success) {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3 text-muted">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mb-4">
          {error ? (error as Error).message : "Không tìm thấy sản phẩm"}
        </div>
        <Link to="/shop" className="btn btn-dark">Quay lại danh sách sản phẩm</Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb banner */}
      <div className="page-title-section section" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">{product.name}</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                  <li className="breadcrumb-item"><Link to="/shop">Cửa hàng</Link></li>
                  <li className="breadcrumb-item active">{product.name}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product details description section */}
      <div className="section section-padding bg-white text-start">
        <div className="container">
          <div className="row g-5">
            
            {/* Product Image Frame */}
            <div className="col-md-6 col-12">
              <div className="product-images border p-4 text-center" style={{ borderRadius: '8px' }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="img-fluid"
                  style={{ maxHeight: '450px', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Product Metadata Info */}
            <div className="col-md-6 col-12">
              <div className="product-summery ps-lg-4">
                <h2 className="product-title mb-3" style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px' }}>
                  {product.name}
                </h2>
                
                <div className="product-price mb-3" style={{ fontSize: '24px', fontWeight: 600, color: '#bd9a5f' }}>
                  £{parseFloat(product.price).toFixed(2)}
                </div>

                <div className="product-description mb-4">
                  <p className="text-muted leading-relaxed" style={{ fontSize: '15px' }}>
                    {product.description || 'Sản phẩm thủ công cao cấp được chế tác tỉ mỉ và tinh xảo theo phong cách Learts.'}
                  </p>
                </div>

                {/* Stock Level status banner */}
                <div className="mb-4 d-flex align-items-center gap-3">
                  <span className="font-weight-bold small text-uppercase text-muted">Tình trạng:</span>
                  <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`} style={{ padding: '6px 12px', fontSize: '12px' }}>
                    {product.stock > 0 ? `Còn lại ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>

                {/* Interactive Quantity Selector & Cart Submitter */}
                {product.stock > 0 && (
                  <div className="product-variations mb-4">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <td className="label" style={{ width: '80px', fontWeight: 600 }}>Số lượng</td>
                          <td className="value">
                            <div className="d-flex align-items-center gap-3">
                              <div className="product-quantity border d-flex align-items-center" style={{ width: '120px', borderRadius: '4px' }}>
                                <button 
                                  className="btn btn-sm border-0 py-2 px-3" 
                                  onClick={() => handleQuantityChange('minus')}
                                  disabled={quantity <= 1}
                                >
                                  -
                                </button>
                                <input 
                                  type="text" 
                                  className="form-control text-center border-0 bg-transparent p-0" 
                                  value={quantity}
                                  readOnly
                                  style={{ fontWeight: 600 }}
                                />
                                <button 
                                  className="btn btn-sm border-0 py-2 px-3" 
                                  onClick={() => handleQuantityChange('plus')}
                                  disabled={quantity >= product.stock}
                                >
                                  +
                                </button>
                              </div>

                              <button 
                                className="btn btn-dark"
                                onClick={handleAddToCart}
                                style={{ padding: '10px 30px' }}
                              >
                                <i className="fas fa-shopping-cart me-2" style={{ marginRight: '8px' }}></i> Thêm vào giỏ hàng
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {successMsg && (
                  <div className="alert alert-success mt-3 animate__animated animate__fadeIn" role="alert">
                    <i className="fas fa-check-circle me-2" style={{ marginRight: '6px' }}></i> Đã thêm sản phẩm vào giỏ hàng thành công!
                  </div>
                )}

                <div className="product-meta mt-5 pt-4 border-top">
                  <table className="small text-muted">
                    <tbody>
                      <tr>
                        <td className="pe-4 pb-2" style={{ width: '120px', fontWeight: 600 }}>Mã sản phẩm:</td>
                        <td className="pb-2">LRT-{product.id}0928</td>
                      </tr>
                      {product.category && (
                        <tr>
                          <td className="pe-4 pb-2" style={{ fontWeight: 600 }}>Danh mục:</td>
                          <td className="pb-2">
                            <span className="badge bg-secondary text-white">{product.category.name}</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
