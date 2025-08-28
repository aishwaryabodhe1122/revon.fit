
import { useEffect, useState } from 'react'; import Layout from '../components/Layout'; import ServiceCard from '../components/ServiceCard'; import { API_BASE } from '../components/config';
type Service={id:string; title:string; price:string; tags:string[]; summary:string; details:string;};
export default function ServicesPage(){
  const [services, setServices] = useState<Service[]>([]);
  useEffect(()=>{ fetch(`${API_BASE}/api/services`).then(r=>r.json()).then(setServices).catch(()=>setServices([])); },[]);
  return (<Layout title="Services"><section className="section"><div className="container">
    <h1 className="fw-bold mb-3">Services & Packages</h1>
    <p className="text-secondary mb-4">Choose from personalized training, online coaching, nutrition planning, and comprehensive transformation packages. Click a card to expand full details.</p>
    <div className="row g-4">{services.map(s=>(<div className="col-md-6 col-lg-4" key={s.id}><ServiceCard service={s}/></div>))}</div>
  </div></section></Layout>);
}
