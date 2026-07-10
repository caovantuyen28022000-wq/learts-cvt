import React, { useState } from 'react';
import { useProductsQuery, useCategoriesQuery } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const ShopPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'none' | 'priceAsc' | 'priceDesc'>('none');
  const itemsPerPage = 6;

  // React Query fetches
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    categoryId: selectedCategoryId
  });

  const { data: categoriesData } = useCategoriesQuery();

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset page to 1 when filter changes
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
  };

  const categories = categoriesData?.data || [];
  let products = productsData?.data?.products || [];
  const totalPages = productsData?.data?.totalPages || 1;

  // Sorting logic applied on the paginated set
  if (sortBy === 'priceAsc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceDesc') {
    products = [...products].sort((a, b) => b.price - a.price);
  }

  return (
    <>
      {/* Page Title Section */}
      <div className="page-title-section section" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Shop Catalog</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#/">Home</a></li>
                  <li className="breadcrumb-item active">Shop</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Section */}
      <div className="section section-padding bg-light">
        <div className="container">
          {/* Filtering and Sorting control bar */}
          <div className="row learts-mb-50 align-items-center justify-content-between">
            {/* Category Filter buttons */}
            <div className="col-md-auto col-12 mb-3 mb-md-0 text-start">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="font-weight-bold text-muted small me-2">Categories:</span>
                <button 
                  className={`btn btn-sm ${selectedCategoryId === null ? 'btn-dark' : 'btn-outline-dark'}`}
                  onClick={() => handleCategorySelect(null)}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    className={`btn btn-sm ${selectedCategoryId === cat.id ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Sorter selector */}
            <div className="col-md-auto col-12 text-start text-md-end">
              <div className="d-inline-flex align-items-center gap-2">
                <span className="font-weight-bold text-muted small">Sort By Price:</span>
                <select 
                  className="form-select form-select-sm border-dark" 
                  value={sortBy}
                  onChange={handleSortChange}
                  style={{ width: '180px', padding: '6px 12px' }}
                >
                  <option value="none">Default Order</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {productsError && (
            <div className="alert alert-danger" role="alert">
              {(productsError as Error).message}
            </div>
          )}

          {/* Grid Area */}
          {productsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status"></div>
              <p className="mt-3 text-muted">Loading products catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-search fa-3x mb-3"></i>
              <p>No products match the selected criteria.</p>
            </div>
          ) : (
            <>
              <div className="row row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4 mb-5">
                {products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="row mt-5">
                  <div className="col text-center">
                    <nav className="d-inline-block">
                      <ul className="pagination justify-content-center m-0 gap-1">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link border-dark text-dark" 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            style={{ borderRadius: '4px' }}
                          >
                            Prev
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
                          <li className={`page-item ${currentPage === pageNo ? 'active' : ''}`} key={pageNo}>
                            <button 
                              className={`page-link border-dark ${currentPage === pageNo ? 'bg-dark text-white' : 'text-dark'}`}
                              onClick={() => setCurrentPage(pageNo)}
                              style={{ borderRadius: '4px' }}
                            >
                              {pageNo}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link border-dark text-dark" 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            style={{ borderRadius: '4px' }}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopPage;
