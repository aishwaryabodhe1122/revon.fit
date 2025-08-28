
import { useEffect, useState } from 'react'; import Layout from '../components/Layout'; import BlogCard from '../components/BlogCard'; import { API_BASE } from '../components/config';
type Blog={id:string; title:string; excerpt:string; content:string; tags:string[]; published_date:string;};
export default function BlogsPage(){
  const [posts, setPosts] = useState<Blog[]>([]); const [email, setEmail] = useState(''); const [status, setStatus] = useState<'idle'|'ok'|'error'>('idle');
  useEffect(()=>{ fetch(`${API_BASE}/api/blogs`).then(r=>r.json()).then(setPosts).catch(()=>setPosts([])); },[]);
  const subscribe = async (e:React.FormEvent)=>{ e.preventDefault(); setStatus('idle'); try{ const r=await fetch(`${API_BASE}/api/subscribe`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})}); setStatus(r.ok?'ok':'error'); }catch{ setStatus('error'); } };
  return (<Layout title="Blogs"><section className="section"><div className="container">
    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4"><div>
      <h1 className="fw-bold mb-2">Latest Articles</h1><p className="text-secondary mb-0">Fitness science, form cues, meal prep, and mindset — curated by your coach.</p></div>
      <form className="d-flex gap-2" onSubmit={subscribe}><input type="email" required className="form-control" placeholder="Your email to subscribe" value={email} onChange={e=>setEmail(e.target.value)}/><button className="btn btn-gold">Subscribe</button></form></div>
    {status==='ok' && <div className="alert alert-success">Subscribed! You will receive new blog updates.</div>}
    {status==='error' && <div className="alert alert-danger">Something went wrong. Please try again.</div>}
    <div className="row g-4">{posts.map(p=>(<div className="col-md-6" key={p.id}><BlogCard post={p}/></div>))}</div>
  </div></section></Layout>);
}
