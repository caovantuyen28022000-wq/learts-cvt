import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const AdminRegister: React.FC = () => {
  const { registerAdmin, setPage, error, clearError } = useCart();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMsg(null);

    if (!username.trim() || !password.trim()) {
      setMsg({ text: "Please enter both username and password.", success: false });
      return;
    }

    if (password !== confirmPassword) {
      setMsg({ text: "Passwords do not match.", success: false });
      return;
    }

    setLoading(true);
    const res = await registerAdmin(username, password);
    setLoading(false);
    
    if (res.success) {
      setMsg({ text: "Registration successful! You can now log in.", success: true });
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setMsg({ text: res.message, success: false });
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
                  <li className="breadcrumb-item"><a href="#home" onClick={(e) => { e.preventDefault(); setPage('home'); }}>Home</a></li>
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
                
                {msg && (
                  <div className={`alert ${msg.success ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {msg.text}
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
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
                    <a 
                      href="#/admin/login" 
                      className="small font-weight-bold text-decoration-none" 
                      style={{ color: '#bd9a5f' }}
                      onClick={(e) => { e.preventDefault(); setPage('admin-login'); }}
                    >
                      Log in here
                    </a>
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

export default AdminRegister;
