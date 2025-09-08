import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { API_BASE } from '../../components/config';
import { authHeaders, getToken, isAuthenticated } from '../../components/auth';

type Package = {
  id: string;
  title: string;
  price: string;
  tags: string[];
  summary: string;
  details: string;
};

export default function AdminPackages() {
  const router = useRouter();
  const [items, setItems] = useState<Package[]>([]);
  const [form, setForm] = useState<Omit<Package, 'id'>>({
    title: '',
    price: '',
    tags: [],
    summary: '',
    details: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/services`, {
        headers: { ...authHeaders() }
      });

      if (!response.ok) {
        throw new Error('Failed to load packages');
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error loading packages:', error);
      setMsg({ text: 'Failed to load packages', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    load();
  }, [router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const payload = {
      title: form.title,
      price: form.price,
      tags: form.tags,
      summary: form.summary,
      details: form.details
    };

    try {
      let response: Response;
      const headers = {
        'Content-Type': 'application/json',
        ...authHeaders()
      };

      if (editingId) {
        response = await fetch(`${API_BASE}/api/admin/services/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_BASE}/api/admin/services`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setForm({ title: '', price: '', tags: [], summary: '', details: '' });
        setEditingId(null);
        setMsg({ text: 'Package saved successfully', type: 'success' });
        load();
      } else {
        throw new Error('Failed to save package');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      setMsg({ text: 'Failed to save package', type: 'error' });
    }
  };

  const edit = (pkg: Package) => {
    setForm({
      title: pkg.title,
      price: pkg.price,
      tags: [...pkg.tags],
      summary: pkg.summary,
      details: pkg.details
    });
    setEditingId(pkg.id);
  };

  const del = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() }
      });

      if (response.ok) {
        setMsg({ text: 'Package deleted successfully', type: 'success' });
        load();
      } else {
        throw new Error('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      setMsg({ text: 'Failed to delete package', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Packages / Services">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Packages / Services">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card-luxe p-4">
            <h5 className="mb-3">{editingId ? 'Edit' : 'Add New'} Package</h5>
            {msg && (
              <div className={`alert alert-${msg.type === 'success' ? 'success' : 'danger'}`}>
                {msg.text}
              </div>
            )}
            <form onSubmit={save}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.tags.join(', ')}
                  onChange={(e) => setForm({
                    ...form,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Summary</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Details</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-gold">
                  {editingId ? 'Update' : 'Save'} Package
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setForm({ title: '', price: '', tags: [], summary: '', details: '' });
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card-luxe p-4">
            <h5 className="mb-3">All Packages</h5>
            {items.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No packages found. Add your first package.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.price}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => edit(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => del(item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
