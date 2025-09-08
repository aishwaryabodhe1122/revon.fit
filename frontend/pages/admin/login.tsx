import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { API_BASE } from '../../components/config';
import { setToken, isAuthenticated } from '../../components/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState<{type: 'info' | 'danger' | 'success', text: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin/contacts');
    }
  }, [router]);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      
      if (response.ok) {
        setOtpSent(true);
        setMsg({ type: 'info', text: 'OTP sent. Please check your email.' });
      } else {
        const error = await response.json().catch(() => ({ detail: 'Unauthorized Credentials!' }));
        setMsg({ type: 'danger', text: error.detail || 'Failed to send OTP' });
      }
    } catch (error) {
      setMsg({ type: 'danger', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });
      
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setMsg({ type: 'success', text: 'Login successful. Redirecting...' });
        router.push('/admin/contacts');
      } else {
        const error = await response.json().catch(() => ({ detail: 'Invalid or expired OTP' }));
        setMsg({ type: 'danger', text: error.detail || 'Invalid or expired OTP' });
      }
    } catch (error) {
      setMsg({ type: 'danger', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isAuthenticated()) {
    return (
      <div className="container section d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ maxWidth: 560 }}>
      <div className="card-luxe p-4">
        <h1 className="fw-bold mb-3">Admin Login</h1>
        
        {!otpSent ? (
          <form onSubmit={requestOtp} className="d-grid gap-3">
            <div>
              <label className="form-label">Email or Phone</label>
              <input 
                className="form-control" 
                placeholder="Enter admin email or phone" 
                value={identifier} 
                onChange={e => setIdentifier(e.target.value)} 
                required 
              />
            </div>
            <button className="btn btn-gold" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            {msg && (
              <div className={`alert alert-${msg.type} ${msg.type === 'danger' ? 'text-danger' : ''}`}>
                {msg.text}
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="d-grid gap-3">
            <div>
              <label className="form-label">Enter OTP</label>
              <input 
                className="form-control" 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                required 
                maxLength={6} 
                type="number"
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
            <button className="btn btn-gold" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline-light" 
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setMsg(null);
              }}
            >
              Change email/phone
            </button>
            {msg && (
              <div className={`alert alert-${msg.type} ${msg.type === 'danger' ? 'text-danger' : ''}`}>
                {msg.text}
              </div>
            )}
          </form>
        )}
        
        <div className="mt-3">
          <Link className="text-secondary" href="/">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
