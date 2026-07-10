import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminRegisterPage: React.FC = () => {
  const { registerAdmin, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localMsg, setLocalMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalMsg(null);

    if (!username.trim() || !password.trim()) {
      setLocalMsg({ text: "Please enter both username and password.", success: false });
      return;
    }

    if (password !== confirmPassword) {
      setLocalMsg({ text: "Passwords do not match.", success: false });
      return;
    }

    setLoading(true);
    const res = await registerAdmin(username, password);
    setLoading(false);
    
    if (res.success) {
      setLocalMsg({ text: "Registration successful! Redirecting to login...", success: true });
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } else {
      setLocalMsg({ text: res.message, success: false });
    }
  };

  return (
    <>
      {/* Page Title Section */}
      <div className="page-title-section section" style={{ backgroundImage: "url('assets/images/bg/page-title-1.webp')" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Admin Registration</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item active">Admin Register</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Section */}
      <div className="section section-padding bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8 col-12">
              <div className="card shadow-sm border-0 p-5 bg-white" style={{ borderRadius: '8px' }}>
                <h3 className="mb-4 text-center" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Register Admin</h3>
                
                {(localMsg || error) && (
                  <div className={`alert ${localMsg?.success ? 'alert-success' : 'alert-danger'} text-start`} role="alert">
                    {localMsg ? localMsg.text : error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 text-start">
                    <label className="form-label font-weight-bold">Username</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                      placeholder="Choose admin username"
                      style={{ padding: '10px 15px' }}
                    />
                  </div>
                  
                  <div className="mb-3 text-start">
                    <label className="form-label font-weight-bold">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Choose password"
                      style={{ padding: '10px 15px' }}
                    />
                  </div>

                  <div className="mb-4 text-start">
                    <label className="form-label font-weight-bold">Confirm Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm password"
                      style={{ padding: '10px 15px' }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-dark btn-hover-primary w-100 py-3 text-uppercase font-weight-bold mb-3"
                    disabled={loading}
                    style={{ letterSpacing: '1px', fontSize: '13px' }}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-muted small">Already have an admin account? </span>
                    <Link 
                      to="/admin/login" 
                      className="small font-weight-bold text-decoration-none" 
                      style={{ color: '#bd9a5f' }}
                    >
                      Log in here
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegisterPage;
