import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const HomePage: React.FC = () => {
  const { products, addToCart, setPage } = useCart();

  useEffect(() => {
    const win = window as any;

    // Initialize Swiper Slider
    let swiperInstance: any = null;
    if (win.Swiper) {
      swiperInstance = new win.Swiper('.home1-slider', {
        loop: true,
        speed: 750,
        effect: 'fade',
        navigation: {
          nextEl: '.home1-slider-next',
          prevEl: '.home1-slider-prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      });
    }

    // Initialize Slick Carousel
    if (win.$ && win.$.fn.slick) {
      win.$('.category-banner1-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: '<button class="slick-prev"><i class="fas fa-long-arrow-alt-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fas fa-long-arrow-alt-right"></i></button>',
        responsive: [
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });
    }

    // Cleanup carousels on unmount
    return () => {
      if (swiperInstance && typeof swiperInstance.destroy === 'function') {
        swiperInstance.destroy(true, true);
      }
      if (win.$ && win.$.fn.slick) {
        try {
          win.$('.category-banner1-carousel').slick('unslick');
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    addToCart(productId, 1);
  };

  const handleNavClick = (e: React.MouseEvent, targetPage: 'shop' | 'cart') => {
    e.preventDefault();
    setPage(targetPage);
  };

  return (
    <>
      {/* Slider main container Start */}
      <div className="home1-slider swiper-container">
        <div className="swiper-wrapper">
          {/* Slide 1 */}
          <div className="home1-slide-item swiper-slide" data-swiper-autoplay="5000" style={{ backgroundImage: "url('assets/images/slider/home1/slide-1.webp')" }}>
            <div className="home1-slide1-content">
              <span className="bg" />
              <span className="slide-border" />
              <span className="icon">
                <img src="assets/images/slider/home1/slide-1-1.webp" alt="Slide Icon" />
              </span>
              <h2 className="title">Handicraft Shop</h2>
              <h3 className="sub-title">Just for you</h3>
              <div className="link">
                <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>shop now</a>
              </div>
            </div>
          </div>
          
          {/* Slide 2 */}
          <div className="home1-slide-item swiper-slide" data-swiper-autoplay="5000" style={{ backgroundImage: "url('assets/images/slider/home1/slide-2.webp')" }}>
            <div className="home1-slide2-content">
              <span className="bg" style={{ backgroundImage: "url('assets/images/slider/home1/slide-2-1.webp')" }} />
              <span className="slide-border" />
              <span className="icon">
                <img src="assets/images/slider/home1/slide-2-2.webp" alt="Slide Icon" />
                <img src="assets/images/slider/home1/slide-2-3.webp" alt="Slide Icon" style={{ marginLeft: '10px' }} />
              </span>
              <h2 className="title">Newly arrived</h2>
              <h3 className="sub-title">Sale up to <br />10%</h3>
              <div className="link">
                <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>shop now</a>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="home1-slide-item swiper-slide" data-swiper-autoplay="5000" style={{ backgroundImage: "url('assets/images/slider/home1/slide-3.webp')" }}>
            <div className="home1-slide3-content">
              <h2 className="title">Affectious gifts</h2>
              <h3 className="sub-title d-flex align-items-center justify-content-center gap-2">
                <img className="left-icon" src="assets/images/slider/home1/slide-2-2.webp" alt="Slide Icon" />
                For friends & family
                <img className="right-icon" src="assets/images/slider/home1/slide-2-3.webp" alt="Slide Icon" />
              </h3>
              <div className="link">
                <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>shop now</a>
              </div>
            </div>
          </div>
        </div>
        <div className="home1-slider-prev swiper-button-prev"><i className="ti-angle-left"></i></div>
        <div className="home1-slider-next swiper-button-next"><i className="ti-angle-right"></i></div>
      </div>
      {/* Slider main container End */}

      {/* Sale Banner Section Start */}
      <div className="section section-padding">
        <div className="container">
          <div className="section-title text-center">
            <h3 className="sub-title">Just for you</h3>
            <h2 className="title title-icon-both">Making & crafting</h2>
          </div>

          <div className="row learts-mb-n40">
            <div className="col-lg-5 col-md-6 col-12 me-auto learts-mb-40">
              <div className="sale-banner1" style={{ backgroundImage: "url('assets/images/banner/sale/sale-banner1-1.webp')" }}>
                <div className="inner">
                  <img src="assets/images/banner/sale/sale-banner1-1.1.webp" alt="Sale Banner Icon" />
                  <span className="title">Spring sale</span>
                  <h2 className="sale-percent">
                    <span className="number">40</span> % <br /> off
                  </h2>
                  <a href="#shop" className="link" onClick={(e) => handleNavClick(e, 'shop')}>shop now</a>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 learts-mb-40">
              <div className="sale-banner2">
                <div className="inner">
                  <div className="image">
                    <img src="assets/images/banner/sale/sale-banner2-1.webp" alt="Sale Banner" />
                  </div>
                  <div className="content row justify-content-between mb-n3 align-items-center">
                    <div className="col-auto mb-3 text-start">
                      <h2 className="sale-percent">10% off</h2>
                      <span className="text">YOUR NEXT PURCHASE</span>
                    </div>
                    <div className="col-auto mb-3">
                      <a className="btn btn-hover-dark" href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>SHOP NOW</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sale Banner Section End */}

      {/* Category Banner Section Start */}
      <div className="section section-fluid section-padding pt-0">
        <div className="container">
          <div className="category-banner1-carousel">
            <div className="col">
              <div className="category-banner1">
                <div className="inner">
                  <a href="#shop" className="image" onClick={(e) => handleNavClick(e, 'shop')}>
                    <img src="assets/images/banner/category/banner-s1-1.webp" alt="Gift ideas" />
                  </a>
                  <div className="content">
                    <h3 className="title">
                      <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>Gift ideas</a>
                      <span className="number">16</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="category-banner1">
                <div className="inner">
                  <a href="#shop" className="image" onClick={(e) => handleNavClick(e, 'shop')}>
                    <img src="assets/images/banner/category/banner-s1-2.webp" alt="Home Decor" />
                  </a>
                  <div className="content">
                    <h3 className="title">
                      <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>Home Decor</a>
                      <span className="number">16</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="category-banner1">
                <div className="inner">
                  <a href="#shop" className="image" onClick={(e) => handleNavClick(e, 'shop')}>
                    <img src="assets/images/banner/category/banner-s1-3.webp" alt="Kids & Babies" />
                  </a>
                  <div className="content">
                    <h3 className="title">
                      <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>Kids & Babies</a>
                      <span className="number">6</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="category-banner1">
                <div className="inner">
                  <a href="#shop" className="image" onClick={(e) => handleNavClick(e, 'shop')}>
                    <img src="assets/images/banner/category/banner-s1-4.webp" alt="Kitchen" />
                  </a>
                  <div className="content">
                    <h3 className="title">
                      <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>Kitchen</a>
                      <span className="number">15</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="category-banner1">
                <div className="inner">
                  <a href="#shop" className="image" onClick={(e) => handleNavClick(e, 'shop')}>
                    <img src="assets/images/banner/category/banner-s1-5.webp" alt="Kniting & Sewing" />
                  </a>
                  <div className="content">
                    <h3 className="title">
                      <a href="#shop" onClick={(e) => handleNavClick(e, 'shop')}>Kniting & Sewing</a>
                      <span className="number">4</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Category Banner Section End */}

      {/* Product Section Start (Best Sellers) */}
      <div className="section section-fluid section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <h3 className="sub-title">Shop now</h3>
            <h2 className="title title-icon-both">Shop our best-sellers</h2>
          </div>

          <div className="products row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 g-4">
            {products.slice(0, 8).map((product) => {
              // Create dynamic hover image path
              const baseImg = product.image;
              const hoverImg = baseImg.replace('.webp', '-hover.webp');

              return (
                <div className="col" key={product.id}>
                  <div className="product">
                    <div className="product-thumb">
                      <a href="#details" className="image" onClick={(e) => e.preventDefault()}>
                        <img src={baseImg} alt={product.name} />
                        <img className="image-hover" src={hoverImg} alt={`${product.name} Hover`} />
                      </a>
                      <a 
                        href="#wishlist" 
                        className="add-to-wishlist hintT-left" 
                        data-hint="Add to wishlist" 
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="far fa-heart" />
                      </a>
                    </div>
                    <div className="product-info">
                      <h6 className="title">
                        <a href="#details" onClick={(e) => e.preventDefault()}>{product.name}</a>
                      </h6>
                      <span className="price">£{product.price.toFixed(2)}</span>
                      <div className="product-buttons">
                        <a href="#quick" className="product-button hintT-top" data-hint="Quick View" onClick={(e) => e.preventDefault()}>
                          <i className="fas fa-search" />
                        </a>
                        <a 
                          href="#add-to-cart" 
                          className="product-button hintT-top" 
                          data-hint="Add to Cart"
                          onClick={(e) => handleQuickAdd(e, product.id)}
                        >
                          <i className="fas fa-shopping-cart" />
                        </a>
                        <a href="#compare" className="product-button hintT-top" data-hint="Compare" onClick={(e) => e.preventDefault()}>
                          <i className="fas fa-random" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-5">
            <button 
              className="btn btn-outline-dark px-5 py-3 text-uppercase font-weight-bold"
              style={{ borderRadius: '0', fontSize: '13px', letterSpacing: '2px' }}
              onClick={() => setPage('shop')}
            >
              Browse Full Catalog
            </button>
          </div>
        </div>
      </div>
      {/* Product Section End */}
    </>
  );
};

export default HomePage;
