import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getToken, removeToken } from './auth';

export default function AdminLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken();
    if (!token && !router.pathname.includes('/admin/login')) {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Remove token and redirect to login
      removeToken();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container">
          <Link className="navbar-brand" href="/admin">Admin • Revvon.Fit</Link>
          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><Link className="nav-link" href="/admin/contacts">Contacts</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/admin/blogs">Blogs</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/admin/packages">Packages</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/admin/subscriptions">Subscriptions</Link></li>
            </ul>
            <div className="d-flex gap-3">
              <Link className="btn btn-outline-light" href="/">View Site</Link>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container section">
        <h1 className="fw-bold mb-4">{title}</h1>
        {children}
      </main>
    </div>
  );
}
