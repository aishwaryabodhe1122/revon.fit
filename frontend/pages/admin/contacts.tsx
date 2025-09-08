import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { API_BASE } from '../../components/config';
import { authHeaders, isAuthenticated } from '../../components/auth';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  query: string;
  created_at: string;
};

export default function AdminContacts() {
  const router = useRouter();
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/contacts`, { 
        headers: { ...authHeaders() } 
      });
      
      if (!response.ok) {
        throw new Error('Failed to load contacts');
      }
      
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact request?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      });
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact');
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <AdminLayout title="Contact Requests">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contact Requests">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="card-luxe p-4">
        <div className="table-responsive">
          <table className="table table-dark align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>WhatsApp</th>
                <th>Query</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No contact requests found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <a href={`mailto:${item.email}`} className="text-white">
                        {item.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${item.phone}`} className="text-white">
                        {item.phone}
                      </a>
                    </td>
                    <td>
                      {item.whatsapp ? (
                        <a 
                          href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white"
                        >
                          {item.whatsapp}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>
                      {item.query}
                    </td>
                    <td>
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteContact(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
