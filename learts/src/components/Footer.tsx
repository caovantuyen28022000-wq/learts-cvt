import React from 'react';

const Footer: React.FC = () => {
  return (
    <>
      <div className="footer2-section section section-padding">
        <div className="container">
          <div className="row learts-mb-n40">
            <div className="col-lg-6 learts-mb-40">
              <div className="widget-about">
                <img src="assets/images/logo/logo-2.webp" alt="Learts Logo" />
                <p style={{ marginTop: '20px' }}>
                  Handcrafted objects designed with passion and detail. Learts offers premium home decor, gifts, and kitchenware that bring warmth and character to your home.
                </p>
              </div>
            </div>

            <div className="col-lg-4 learts-mb-40">
              <div className="row">
                <div className="col">
                  <ul className="widget-list">
                    <li><a href="#about">About us</a></li>
                    <li><a href="#store">Store location</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="#orders">Orders</a></li>
                  </ul>
                </div>
                <div className="col">
                  <ul className="widget-list">
                    <li><a href="#returns">Returns</a></li>
                    <li><a href="#support">Support Policy</a></li>
                    <li><a href="#size-guide">Size Guide</a></li>
                    <li><a href="#faqs">FAQs</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-2 learts-mb-40">
              <ul className="widget-list">
                <li>
                  <i className="fab fa-twitter" style={{ marginRight: '10px' }}></i> 
                  <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">Twitter</a>
                </li>
                <li>
                  <i className="fab fa-facebook-f" style={{ marginRight: '10px' }}></i> 
                  <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
                </li>
                <li>
                  <i className="fab fa-instagram" style={{ marginRight: '10px' }}></i> 
                  <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
                </li>
                <li>
                  <i className="fab fa-youtube" style={{ marginRight: '10px' }}></i> 
                  <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">Youtube</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer2-copyright section">
        <div className="container">
          <p className="copyright text-center">&copy; 2026 learts. All Rights Reserved</p>
        </div>
      </div>
    </>
  );
};

export default Footer;