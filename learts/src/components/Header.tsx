import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUserAuthStore } from '../store/useUserAuthStore';

const Header: React.FC = () => {
  const { cart, setIsCartOpen, fetchCart } = useCartStore();
  const { userToken, userUsername, logoutUser } = useUserAuthStore();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  return (
    <>
      {/* Topbar Section Start */}
      <div className="topbar-section section bg-primary2">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-auto col-12">
              <p className="text-white text-center text-md-left my-2">Free shipping for orders over $59 !</p>
            </div>
            <div className="col-auto d-none d-md-block">
              <div className="topbar-menu">
                <ul>
                  <li><a href="#store" className="text-white" onClick={(e) => e.preventDefault()}><i className="fa fa-map-marker-alt" style={{ marginRight: '5px' }}></i>Store Location</a></li>
                  <li><Link to="/orders" className="text-white"><i className="fa fa-truck" style={{ marginRight: '5px' }}></i>Order Status</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar Section End */}

      {/* Header Section Start */}
      <div className="header-section section bg-white d-none d-xl-block">
        <div className="container">
          <div className="row row-cols-lg-3 align-items-center">
            {/* Header Language & Currency Start */}
            <div className="col">
              <ul className="header-lan-curr">
                <li>
                  <a href="#lang" onClick={(e) => e.preventDefault()}>English</a>
                  <ul className="curr-lan-sub-menu">
                    <li><a href="#lang" onClick={(e) => e.preventDefault()}>Français</a></li>
                    <li><a href="#lang" onClick={(e) => e.preventDefault()}>Deutsch</a></li>
                  </ul>
                </li>
                <li>
                  <a href="#curr" onClick={(e) => e.preventDefault()}>GBP</a>
                  <ul className="curr-lan-sub-menu">
                    <li><a href="#curr" onClick={(e) => e.preventDefault()}>USD</a></li>
                    <li><a href="#curr" onClick={(e) => e.preventDefault()}>EUR</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            {/* Header Language & Currency End */}

            {/* Header Logo Start */}
            <div className="col">
              <div className="header-logo justify-content-center">
                <Link to="/">
                  <img src="assets/images/logo/logo.webp" alt="Learts Logo" />
                </Link>
              </div>
            </div>
            {/* Header Logo End */}

            {/* Header Tools Start */}
            <div className="col">
              <div className="header-tools justify-content-end">
                <div className="header-login">
                  <Link to={userToken ? "/orders" : "/login-register"} title={userToken ? `My Account (${userUsername})` : "Login / Register"}>
                    <i className="far fa-user" />
                    {userToken && <span className="small text-muted" style={{ fontSize: '11px', marginLeft: '5px' }}>{userUsername}</span>}
                  </Link>
                </div>
                <div className="header-search">
                  <a href="#search" onClick={(e) => e.preventDefault()} className="offcanvas-toggle">
                    <i className="fas fa-search" />
                  </a>
                </div>
                <div className="header-wishlist">
                  <a href="#wishlist" onClick={(e) => e.preventDefault()} className="offcanvas-toggle">
                    <span className="wishlist-count">0</span>
                    <i className="far fa-heart" />
                  </a>
                </div>
                <div className="header-cart">
                  <a href="#cart" onClick={handleCartClick} className="offcanvas-toggle">
                    <span className="cart-count">{totalItems}</span>
                    <i className="fas fa-shopping-cart" />
                  </a>
                </div>
              </div>
            </div>
            {/* Header Tools End */}
          </div>
        </div>

        {/* Site Menu Section Start */}
        <div className="site-menu-section section">
          <div className="container">
            <nav className="site-main-menu justify-content-center">
              <ul>
                <li className="has-children">
                  <Link to="/">
                    <span className="menu-text">Home</span>
                  </Link>
                  <ul className="sub-menu mega-menu">
                    <li>
                      <Link to="/" className="mega-menu-title">
                        <span className="menu-text">HOME GROUP</span>
                      </Link>
                      <ul>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-01.webp" alt="home-01" /> 
                          <Link to="/"><span className="menu-text">Arts Propelled</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-02.webp" alt="home-02" /> 
                          <Link to="/"><span className="menu-text">Decor Thriving</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-03.webp" alt="home-03" /> 
                          <Link to="/"><span className="menu-text">Savvy Delight</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-04.webp" alt="home-04" /> 
                          <Link to="/"><span className="menu-text">Perfect Escapes</span></Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/" className="mega-menu-title">
                        <span className="menu-text">HOME GROUP</span>
                      </Link>
                      <ul>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-05.webp" alt="home-05" /> 
                          <Link to="/"><span className="menu-text">Kitchen Cozy</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-06.webp" alt="home-06" /> 
                          <Link to="/"><span className="menu-text">Dreamy Designs</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-07.webp" alt="home-07" /> 
                          <Link to="/"><span className="menu-text">Crispy Recipes</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-08.webp" alt="home-08" /> 
                          <Link to="/"><span className="menu-text">Decoholic Chic</span></Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/" className="mega-menu-title">
                        <span className="menu-text">HOME GROUP</span>
                      </Link>
                      <ul>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-9.webp" alt="home-9" /> 
                          <Link to="/"><span className="menu-text">Reblended Dish</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-10.webp" alt="home-10" /> 
                          <Link to="/"><span className="menu-text">Craftin House</span></Link>
                        </li>
                        <li> 
                          <img className="mmh_img" src="assets/images/demo/menu/home-11.webp" alt="home-11" /> 
                          <Link to="/"><span className="menu-text">Craftswork Biz</span></Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/shop" className="menu-banner">
                        <img src="assets/images/banner/menu-banner-1.webp" alt="Home Menu Banner" />
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="has-children">
                  <Link to="/shop">
                    <span className="menu-text">Shop</span>
                  </Link>
                  <ul className="sub-menu mega-menu">
                    <li>
                      <Link to="/shop" className="mega-menu-title">
                        <span className="menu-text">SHOP PAGES</span>
                      </Link>
                      <ul>
                        <li><Link to="/shop"><span className="menu-text">Shop Catalog</span></Link></li>
                        <li><Link to="/cart"><span className="menu-text">Shopping Cart</span></Link></li>
                        <li><Link to="/checkout"><span className="menu-text">Checkout</span></Link></li>
                        <li><Link to="/orders"><span className="menu-text">Order Tracking</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/shop" className="mega-menu-title">
                        <span className="menu-text">PRODUCT PAGES</span>
                      </Link>
                      <ul>
                        <li><Link to="/shop"><span className="menu-text">Basic</span></Link></li>
                        <li><Link to="/shop"><span className="menu-text">Fullwidth</span></Link></li>
                        <li><Link to="/shop"><span className="menu-text">Sticky Details</span></Link></li>
                        <li><Link to="/shop"><span className="menu-text">Width Sidebar</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/shop" className="mega-menu-title">
                        <span className="menu-text">PRODUCT &amp; Other PAGES</span>
                      </Link>
                      <ul>
                        <li><Link to="/cart"><span className="menu-text">Shopping Cart</span></Link></li>
                        <li><Link to="/checkout"><span className="menu-text">Checkout</span></Link></li>
                        <li><Link to="/orders"><span className="menu-text">My Account</span></Link></li>
                      </ul>
                    </li>
                    <li className="align-self-center">
                      <Link to="/shop" className="menu-banner">
                        <img src="assets/images/banner/menu-banner-2.webp" alt="Shop Menu Banner" />
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="has-children">
                  <Link to="/orders">
                    <span className="menu-text">Project</span>
                  </Link>
                  <ul className="sub-menu">
                    <li><Link to="/shop"><span className="menu-text">Portfolio 3 Columns</span></Link></li>
                    <li><Link to="/shop"><span className="menu-text">Portfolio 4 Columns</span></Link></li>
                  </ul>
                </li>

                <li className="has-children">
                  <Link to="/shop">
                    <span className="menu-text">Elements</span>
                  </Link>
                  <ul className="sub-menu mega-menu">
                    <li>
                      <Link to="/shop" className="mega-menu-title">
                        <span className="menu-text">Column One</span>
                      </Link>
                      <ul>
                        <li><Link to="/shop"><span className="menu-text">Product Styles</span></Link></li>
                        <li><Link to="/shop"><span className="menu-text">Product Tabs</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <Link to="/shop" className="mega-menu-title">
                        <span className="menu-text">Column Two</span>
                      </Link>
                      <ul>
                        <li><Link to="/shop"><span className="menu-text">Category Banner</span></Link></li>
                        <li><Link to="/shop"><span className="menu-text">Team Member</span></Link></li>
                      </ul>
                    </li>
                  </ul>
                </li>

                <li className="has-children">
                  <Link to="/shop">
                    <span className="menu-text">Blog</span>
                  </Link>
                  <ul className="sub-menu">
                    <li><Link to="/shop"><span className="menu-text">Standard Layout</span></Link></li>
                    <li><Link to="/shop"><span className="menu-text">Grid Layout</span></Link></li>
                  </ul>
                </li>

                <li className="has-children">
                  <Link to="/shop">
                    <span className="menu-text">Pages</span>
                  </Link>
                  <ul className="sub-menu">
                    <li><Link to="/shop"><span className="menu-text">About us</span></Link></li>
                    <li><Link to="/orders"><span className="menu-text">Orders History</span></Link></li>
                    {userToken ? (
                      <li><a href="#logout" onClick={(e) => { e.preventDefault(); logoutUser(); }}><span className="menu-text">Logout ({userUsername})</span></a></li>
                    ) : (
                      <li><Link to="/login-register"><span className="menu-text">Login / Register</span></Link></li>
                    )}
                    <li><Link to="/admin/login"><span className="menu-text">Admin Login</span></Link></li>
                    <li><Link to="/cart"><span className="menu-text">Giỏ hàng</span></Link></li>
                    <li><Link to="/checkout"><span className="menu-text">Checkout</span></Link></li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/* Site Menu Section End */}
      </div>
      {/* Header Section End */}

      {/* Header Sticky Section Start */}
      <div className="sticky-header header-menu-center section bg-white d-none d-xl-block">
        <div className="container">
          <div className="row align-items-center">
            {/* Header Logo Start */}
            <div className="col">
              <div className="header-logo">
                <Link to="/">
                  <img src="assets/images/logo/logo-2.webp" alt="Learts Logo" />
                </Link>
              </div>
            </div>
            {/* Header Logo End */}

            {/* Menu Start */}
            <div className="col d-none d-xl-block">
              <nav className="site-main-menu justify-content-center">
                <ul>
                  <li>
                    <Link to="/">
                      <span className="menu-text">Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop">
                      <span className="menu-text">Shop</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart">
                      <span className="menu-text">Cart ({totalItems})</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders">
                      <span className="menu-text">Orders</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            {/* Menu End */}

            {/* Header Tools Start */}
            <div className="col-auto">
              <div className="header-tools justify-content-end">
                <div className="header-login">
                  <Link to={userToken ? "/orders" : "/login-register"} title={userToken ? `My Account (${userUsername})` : "Login / Register"}>
                    <i className="far fa-user" />
                  </Link>
                </div>
                <div className="header-wishlist">
                  <a href="#wishlist" onClick={(e) => e.preventDefault()}>
                    <span className="wishlist-count">0</span>
                    <i className="far fa-heart" />
                  </a>
                </div>
                <div className="header-cart">
                  <a href="#cart" onClick={handleCartClick}>
                    <span className="cart-count">{totalItems}</span>
                    <i className="fas fa-shopping-cart" />
                  </a>
                </div>
              </div>
            </div>
            {/* Header Tools End */}
          </div>
        </div>
      </div>
      {/* Header Sticky Section End */}

      {/* Mobile Header Section Start */}
      <div className="mobile-header bg-white section d-xl-none">
        <div className="container">
          <div className="row align-items-center">
            {/* Header Logo Start */}
            <div className="col">
              <div className="header-logo">
                <Link to="/">
                  <img src="assets/images/logo/logo-2.webp" alt="Learts Logo" />
                </Link>
              </div>
            </div>
            {/* Header Logo End */}

            {/* Header Tools Start */}
            <div className="col-auto">
              <div className="header-tools justify-content-end">
                <div className="header-login d-none d-sm-block">
                  <Link to={userToken ? "/orders" : "/login-register"} title={userToken ? `My Account (${userUsername})` : "Login / Register"}>
                    <i className="far fa-user" />
                  </Link>
                </div>
                <div className="header-cart">
                  <a href="#cart" onClick={handleCartClick}>
                    <span className="cart-count">{totalItems}</span>
                    <i className="fas fa-shopping-cart" />
                  </a>
                </div>
                <div className="mobile-menu-toggle">
                  <a href="#mobile-menu" onClick={handleCartClick}>
                    <svg viewBox="0 0 800 600">
                      <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" className="top" />
                      <path d="M300,320 L540,320" className="middle" />
                      <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" className="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) " />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            {/* Header Tools End */}
          </div>
        </div>
      </div>
      {/* Mobile Header Section End */}
    </>
  );
};

export default Header;