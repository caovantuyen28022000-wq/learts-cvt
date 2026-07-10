import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuthStore } from '../store/useUserAuthStore';

const LoginRegisterPage: React.FC = () => {
  const { loginUser, registerUser, clearError } = useUserAuthStore();
  const navigate = useNavigate();

  // View state toggle: true for Register form, false for Login form
  const [isRegister, setIsRegister] = useState(false);

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register inputs
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMsg, setRegMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoginErr(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginErr("Please enter both email and password.");
      return;
    }

    setLoginLoading(true);
    const res = await loginUser(loginEmail, loginPassword);
    setLoginLoading(false);

    if (res.success) {
      navigate('/shop');
    } else {
      setLoginErr(res.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setRegMsg(null);

    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegMsg({ text: "Please fill out all registration fields.", success: false });
      return;
    }

    setRegLoading(true);
    const res = await registerUser(regUsername, regEmail, regPassword);
    setRegLoading(false);

    if (res.success) {
      setRegMsg({ text: "Registration successful! You can now log in.", success: true });
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
      // Delay auto toggle back to login form so they see the success message
      setTimeout(() => {
        setIsRegister(false);
        setRegMsg(null);
      }, 2000);
    } else {
      setRegMsg({ text: res.message, success: false });
    }
  };

  const toggleView = (e: React.MouseEvent, showRegister: boolean) => {
    e.preventDefault();
    clearError();
    setLoginErr(null);
    setRegMsg(null);
    setIsRegister(showRegister);
  };

  return (
    <>
      {/* Page Title Section */}
      <div className="page-title-section section" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">My Account</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item active">{isRegister ? 'Register' : 'Login'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Login / Register Form Card */}
      <div className="section section-padding bg-light">
        <div className="container">
          <div className="row justify-content-center animate__animated animate__fadeIn">
            <div className="col-lg-5 col-md-8 col-12 text-start">
              
              {!isRegister ? (
                /* Login View */
                <div className="card shadow-sm border-0 p-5 bg-white" style={{ borderRadius: '8px' }}>
                  <h3 className="mb-4 text-center font-weight-bold" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>Login</h3>
                  
                  {loginErr && (
                    <div className="alert alert-danger py-2 mb-3" role="alert">
                      {loginErr}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                      <label className="form-label font-weight-bold">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required 
                        placeholder="Enter your email"
                        style={{ padding: '10px 15px' }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label font-weight-bold">Password *</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required 
                        placeholder="Enter your password"
                        style={{ padding: '10px 15px' }}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="remember" />
                        <label className="form-check-label small text-muted" htmlFor="remember">Remember me</label>
                      </div>
                      <a href="#lost" onClick={(e) => e.preventDefault()} className="small text-decoration-none" style={{ color: '#bd9a5f' }}>Lost password?</a>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-dark w-100 py-3 text-uppercase font-weight-bold mb-4"
                      disabled={loginLoading}
                      style={{ letterSpacing: '1px', fontSize: '13px' }}
                    >
                      {loginLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="text-center mt-3 pt-3 border-top d-flex flex-column gap-2">
                      <div>
                        <span className="text-muted small">Don't have an account? </span>
                        <a 
                          href="#register" 
                          onClick={(e) => toggleView(e, true)}
                          className="small font-weight-bold text-decoration-none" 
                          style={{ color: '#bd9a5f' }}
                        >
                          Register Account
                        </a>
                      </div>
                      <div>
                        <span className="text-muted small">Are you an administrator? </span>
                        <Link 
                          to="/admin/login"
                          className="small font-weight-bold text-decoration-none" 
                          style={{ color: '#666' }}
                        >
                          Admin Login
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Register View */
                <div className="card shadow-sm border-0 p-5 bg-white" style={{ borderRadius: '8px' }}>
                  <h3 className="mb-4 text-center font-weight-bold" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>Register</h3>
                  
                  {regMsg && (
                    <div className={`alert ${regMsg.success ? 'alert-success' : 'alert-danger'} py-2 mb-3`} role="alert">
                      {regMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit}>
                    <div className="mb-3">
                      <label className="form-label font-weight-bold">Username *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        required 
                        placeholder="Choose a username"
                        style={{ padding: '10px 15px' }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label font-weight-bold">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required 
                        placeholder="Enter email address"
                        style={{ padding: '10px 15px' }}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label font-weight-bold">Password *</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required 
                        placeholder="Choose a secure password"
                        style={{ padding: '10px 15px' }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-dark w-100 py-3 text-uppercase font-weight-bold mb-4"
                      disabled={regLoading}
                      style={{ letterSpacing: '1px', fontSize: '13px' }}
                    >
                      {regLoading ? 'Registering...' : 'Register'}
                    </button>

                    <div className="text-center mt-3 pt-3 border-top">
                      <span className="text-muted small">Already have an account? </span>
                      <a 
                        href="#login" 
                        onClick={(e) => toggleView(e, false)}
                        className="small font-weight-bold text-decoration-none" 
                        style={{ color: '#bd9a5f' }}
                      >
                        Login Here
                      </a>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegisterPage;
