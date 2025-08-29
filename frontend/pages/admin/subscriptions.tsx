import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { API_BASE } from '../../components/config';
import { getToken } from '../../components/auth';

type Subscription = {
  id: number;
  email: string;
  created_at: string;
  is_active: boolean;
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubscriptions = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/admin/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/admin/subscriptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      } else {
        alert('Failed to delete subscription');
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('An error occurred');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-2">Email Subscriptions</h1>
            <p className="text-secondary mb-0">Manage all email subscriptions for newsletters and updates</p>
          </div>
          <div className="d-flex gap-2">
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search subscriptions"
              />
              <button 
                className="btn btn-primary d-flex align-items-center justify-content-center"
                style={{ width: '40px' }}
                title="Search subscriptions"
                aria-label="Search subscriptions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
            <button 
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
              style={{ width: '40px' }}
              onClick={fetchSubscriptions}
              title="Refresh subscriptions"
              aria-label="Refresh subscriptions"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-0">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Email</th>
                      <th>Subscribed On</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.length > 0 ? (
                      filteredSubscriptions.map((sub) => (
                        <tr key={sub.id}>
                          <td className="align-middle">
                            <a href={`mailto:${sub.email}`} className="text-decoration-none">
                              {sub.email}
                            </a>
                          </td>
                          <td className="align-middle">
                            {new Date(sub.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="align-middle">
                            <span className={`badge ${sub.is_active ? 'bg-success' : 'bg-secondary'}`}>
                              {sub.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="text-end align-middle">
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="btn btn-sm p-0 border-0 bg-transparent"
                              title={`Delete ${sub.email}`}
                              aria-label={`Delete ${sub.email}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dc3545" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center p-4 text-muted">
                          {searchTerm ? 'No matching subscriptions found' : 'No subscriptions yet'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {!loading && subscriptions.length > 0 && (
            <div className="card-footer bg-transparent">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing <strong>{filteredSubscriptions.length}</strong> of <strong>{subscriptions.length}</strong> subscriptions
                </small>
                {searchTerm && (
                  <button 
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
