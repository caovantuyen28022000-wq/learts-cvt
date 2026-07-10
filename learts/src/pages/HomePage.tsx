import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductsQuery } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  // Fetch products using TanStack query (fetch page 1, limit 4 for featured list)
  const { data: productsData, isLoading: productsLoading } = useProductsQuery({ page: 1, limit: 4 });

  useEffect(() => {
    const win = window as any;
    let homeSlider: any = null;

    if (win.Swiper) {
      homeSlider = new win.Swiper('.home2-slider', {
        loop: true,
        speed: 800,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.home2-slider-next',
          prevEl: '.home2-slider-prev',
        },
      });
    }

    return () => {
      if (homeSlider && homeSlider.destroy) {
        homeSlider.destroy(true, true);
      }
    };
  }, []);

  const featuredProducts = productsData?.data?.products || [];

  return (
    <>
      {/* Slider main container Start */}
      <div className="home2-slider swiper-container">
        <div className="swiper-wrapper">
          {/* Slide 1 */}
          <div className="home2-slide-item swiper-slide" style={{ backgroundColor: "#EEE5DD" }}>
            <div className="home2-slide1-image">
              <img src="assets/images/slider/home2/slider-1-1.webp" alt="Slide One Image" />
              <div className="home2-slide1-product1">
                <button className="slide-pointer"><span>+</span></button>
                <div className="slide-product">
                  <div className="image"><img src="assets/images/slider/home2/slider-1-2.webp" alt="Slide Product Image" /></div>
                  <h6 className="title">Country Feast set</h6>
                  <span className="price">£39.00</span>
                </div>
              </div>
            </div>
            <div className="home2-slide-content">
              <h5 className="sub-title">DAILY OFFER</h5>
              <h2 className="title" style={{ fontFamily: 'Playfair Display, serif' }}>Country Feast Set</h2>
              <div className="link"><Link to="/shop">shop collection</Link></div>
            </div>
            <div className="home2-slide-pages">
              <span className="current">1</span>
              <span className="border"></span>
              <span className="total">3</span>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="home2-slide-item swiper-slide" style={{ backgroundColor: "#F5F1F1" }}>
            <div className="home2-slide2-image">
              <img src="assets/images/slider/home2/slider-2-1.webp" alt="Slide Two Image" />
              <div className="home2-slide2-product1">
                <button className="slide-pointer"><span>+</span></button>
                <div className="slide-product">
                  <div className="image"><img src="assets/images/slider/home2/slider-2-2.webp" alt="Slide Product Image" /></div>
                  <h6 className="title">Country Feast set</h6>
                  <span className="price">£39.00</span>
                </div>
              </div>
              <div className="home2-slide2-product2">
                <button className="slide-pointer"><span>+</span></button>
                <div className="slide-product">
                  <div className="image"><img src="assets/images/slider/home2/slider-2-3.webp" alt="Slide Product Image" /></div>
                  <h6 className="title">Country Feast set</h6>
                  <span className="price">£39.00</span>
                </div>
              </div>
            </div>
            <div className="home2-slide-content">
              <h5 className="sub-title">DAILY OFFER</h5>
              <h2 className="title" style={{ fontFamily: 'Playfair Display, serif' }}>DESIGNS FOR YOU</h2>
              <div className="link"><Link to="/shop">shop collection</Link></div>
            </div>
            <div className="home2-slide-pages">
              <span className="current">2</span>
              <span className="border"></span>
              <span className="total">3</span>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="home2-slide-item swiper-slide" style={{ backgroundColor: "#F1DED0" }}>
            <div className="home2-slide3-image">
              <img src="assets/images/slider/home2/slider-3-1.webp" alt="Slide Three Image" />
              <div className="home2-slide3-product1">
                <button className="slide-pointer"><span>+</span></button>
                <div className="slide-product">
                  <div className="image"><img src="assets/images/slider/home2/slider-3-2.webp" alt="Slide Product Image" /></div>
                  <h6 className="title">Country Feast set</h6>
                  <span className="price">£39.00</span>
                </div>
              </div>
              <div className="home2-slide3-product2">
                <button className="slide-pointer"><span>+</span></button>
                <div className="slide-product">
                  <div className="image"><img src="assets/images/slider/home2/slider-3-3.webp" alt="Slide Product Image" /></div>
                  <h6 className="title">Country Feast set</h6>
                  <span className="price">£39.00</span>
                </div>
              </div>
            </div>
            <div className="home2-slide-content">
              <h5 className="sub-title">DAILY OFFER</h5>
              <h2 className="title" style={{ fontFamily: 'Playfair Display, serif' }}>Country Feast Set</h2>
              <div className="link"><Link to="/shop">shop collection</Link></div>
            </div>
            <div className="home2-slide-pages">
              <span className="current">3</span>
              <span className="border"></span>
              <span className="total">3</span>
            </div>
          </div>
        </div>
        <div className="home2-slider-prev swiper-button-prev"><i className="ti-angle-left"></i></div>
        <div className="home2-slider-next swiper-button-next"><i className="ti-angle-right"></i></div>
      </div>
      {/* Slider main container End */}

      {/* Sale Banner Section Start */}
      <div className="section section-padding" style={{ backgroundImage: "url('assets/images/bg/home-2.webp')", backgroundSize: 'cover' }}>
        <div className="container">
          <div className="row learts-mb-n30">
            <div className="col-lg-5 col-12 ms-auto align-self-center learts-mb-30">
              <div className="about-us text-start">
                <div className="inner">
                  <img className="logo mb-3" src="assets/images/logo/logo-3.webp" alt="Site Logo" />
                  <h2 className="title mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Making & crafting</h2>
                  <span className="special-title mb-3 d-block text-muted">Handicraft shop</span>
                  <p className="mb-4">Crafting beautiful stuff with our own hands and the help from useful tools is a wonderful process, where you can enjoy yourself while pulling out some ideas and busy perfecting your work.</p>
                  <Link to="/shop" className="link text-uppercase font-weight-bold" style={{ borderBottom: '1px solid', paddingBottom: '2px', color: '#000' }}>Online Store</Link>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
              <div className="category-banner2 text-start">
                <Link to="/shop" className="inner">
                  <div className="image"><img src="assets/images/banner/category/banner-s2-1.webp" alt="" /></div>
                  <div className="content">
                    <h3 className="title">Kids &amp; Babies<span className="number">6 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc right">NEW COLLECTION</span>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 col-12 learts-mb-30">
              <div className="category-banner2 text-start">
                <Link to="/shop" className="inner">
                  <div className="image"><img src="assets/images/banner/category/banner-s2-2.webp" alt="" /></div>
                  <div className="content">
                    <h3 className="title">Kniting &amp; Sewing<span className="number">4 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc right">SALE UP TO 40%</span>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
              <div className="section-padding pb-0 d-none d-lg-block"></div>
              <div className="category-banner2 text-start">
                <Link to="/shop" className="inner">
                  <div className="image"><img src="assets/images/banner/category/banner-s2-3.webp" alt="" /></div>
                  <div className="content">
                    <h3 className="title">Gift ideas<span className="number">16 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc right">BEST SELLERS</span>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
              <div className="section learts-pt-40 d-none d-lg-block"></div>
              <div className="category-banner2 text-start">
                <Link to="/shop" className="inner">
                  <div className="image"><img src="assets/images/banner/category/banner-s2-4.webp" alt="" /></div>
                  <div className="content">
                    <h3 className="title">Home Decor<span className="number">16 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc left">BEST SELLERS</span>
              </div>
            </div>

            <div className="d-flex align-items-center col-lg-5 col-12 ms-auto learts-mb-30">
              <div className="sale-banner3 text-start">
                <span className="special-title text-muted">Spring sale</span>
                <h2 className="title mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Sale up to 10% off</h2>
                <Link to="/shop" className="link text-uppercase font-weight-bold" style={{ borderBottom: '1px solid', paddingBottom: '2px', color: '#000' }}>ONLINE STORE</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sale Banner Section End */}

      {/* Featured Products Section (As required) */}
      <div className="section section-padding border-top bg-white">
        <div className="container">
          <div className="section-title2 text-center mb-5">
            <h3 className="sub-title">Shop our catalog</h3>
            <h2 className="title" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Featured Products</h2>
          </div>

          {productsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status"></div>
              <p className="mt-3 text-muted">Loading featured catalog...</p>
            </div>
          ) : (
            <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
              {featuredProducts.map((p: any) => (
                <ProductCard product={p} key={p.id} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section Start */}
      <div className="section section-padding border-top bg-light">
        <div className="container">
          <div className="section-title2 text-center mb-5">
            <h3 className="sub-title">Follow us on Instagram</h3>
            <h2 className="title" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>@learts_shop</h2>
          </div>

          <div className="instafeed instafeed-carousel row row-cols-lg-4 row-cols-sm-2 row-cols-1 g-3">
            <div className="col">
              <a className="instafeed-item d-block position-relative" href="#insta" onClick={(e) => e.preventDefault()}>
                <img src="assets/images/instagram/instagram-1.webp" alt="instagram" className="w-100" style={{ borderRadius: '4px' }} />
                <i className="fab fa-instagram position-absolute top-50 start-50 translate-middle text-white fa-2x" style={{ opacity: 0.8 }}></i>
              </a>
            </div>
            <div className="col">
              <a className="instafeed-item d-block position-relative" href="#insta" onClick={(e) => e.preventDefault()}>
                <img src="assets/images/instagram/instagram-2.webp" alt="instagram" className="w-100" style={{ borderRadius: '4px' }} />
                <i className="fab fa-instagram position-absolute top-50 start-50 translate-middle text-white fa-2x" style={{ opacity: 0.8 }}></i>
              </a>
            </div>
            <div className="col">
              <a className="instafeed-item d-block position-relative" href="#insta" onClick={(e) => e.preventDefault()}>
                <img src="assets/images/instagram/instagram-3.webp" alt="instagram" className="w-100" style={{ borderRadius: '4px' }} />
                <i className="fab fa-instagram position-absolute top-50 start-50 translate-middle text-white fa-2x" style={{ opacity: 0.8 }}></i>
              </a>
            </div>
            <div className="col">
              <a className="instafeed-item d-block position-relative" href="#insta" onClick={(e) => e.preventDefault()}>
                <img src="assets/images/instagram/instagram-4.webp" alt="instagram" className="w-100" style={{ borderRadius: '4px' }} />
                <i className="fab fa-instagram position-absolute top-50 start-50 translate-middle text-white fa-2x" style={{ opacity: 0.8 }}></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Gallery Section End */}
    </>
  );
};

export default HomePage;
