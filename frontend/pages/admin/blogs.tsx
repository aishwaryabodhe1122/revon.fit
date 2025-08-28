
import { useEffect, useState } from 'react'; import AdminLayout from '../../components/AdminLayout'; import { API_BASE } from '../../components/config'; import { authHeaders, getToken } from '../../components/auth';
type Blog={id:string; title:string; excerpt:string; content:string; tags:string[]; published_date:string;};
export default function AdminBlogs(){
  const [posts, setPosts] = useState<Blog[]>([]); const [form, setForm] = useState({ title:'', excerpt:'', content:'', tags:'' }); const [msg, setMsg] = useState<string>('');
  const load = async ()=>{ const r=await fetch(`${API_BASE}/api/blogs`); setPosts(await r.json()); };
  useEffect(()=>{ if(!getToken()){ window.location.href='/admin/login'; return; } load(); },[]);
  const createPost = async (e:React.FormEvent)=>{ e.preventDefault(); setMsg(''); const payload = { title:form.title, excerpt:form.excerpt, content:form.content, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) }; const r=await fetch(`${API_BASE}/api/admin/blogs`,{ method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body:JSON.stringify(payload)}); if(r.ok){ setForm({ title:'', excerpt:'', content:'', tags:'' }); await load(); setMsg('Blog published successfully.'); } else setMsg('Failed to publish blog.'); };
  return (<AdminLayout title="Blogs"><div className="row g-4">
    <div className="col-lg-5"><div className="card-luxe p-4"><h5 className="mb-3">Create New Blog</h5><form onSubmit={createPost} className="d-grid gap-3">
      <div><label className="form-label">Title</label><input className="form-control" required value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></div>
      <div><label className="form-label">Excerpt</label><textarea className="form-control" rows={2} required value={form.excerpt} onChange={e=>setForm({...form, excerpt:e.target.value})}></textarea></div>
      <div><label className="form-label">Content</label><textarea className="form-control" rows={6} required value={form.content} onChange={e=>setForm({...form, content:e.target.value})}></textarea></div>
      <div><label className="form-label">Tags (comma separated)</label><input className="form-control" placeholder="Training, Nutrition" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})}/></div>
      <button className="btn btn-gold">Publish</button>{msg && <div className="alert alert-info mt-2">{msg}</div>}
    </form></div></div>
    <div className="col-lg-7"><div className="card-luxe p-4"><h5 className="mb-3">Published Posts</h5><div className="list-group list-group-flush">
      {posts.map(p=>(<div className="list-group-item bg-transparent text-white border-secondary d-flex justify-content-between align-items-start" key={p.id}><div>
        <div className="fw-semibold">{p.title}</div><small className="text-secondary">{new Date(p.published_date).toLocaleString()} • {p.tags.join(', ')}</small><div className="text-secondary mt-2" style={{whiteSpace:'pre-wrap'}}>{p.excerpt}</div>
      </div></div>))}{posts.length===0 && <div className="text-secondary">No posts yet.</div>}
    </div></div></div>
  </div></AdminLayout>);
}
