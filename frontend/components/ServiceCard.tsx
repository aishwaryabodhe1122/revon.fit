
import { useState } from 'react';
type Service = { id:string; title:string; price:string; tags:string[]; summary:string; details:string; };
export default function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const id = `svc_${service.id}`;
  return (
    <div className="card-luxe p-3 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start">
        <h5 className="mb-2">{service.title}</h5><span className="badge-gold">{service.price}</span>
      </div>
      <p className="text-secondary flex-grow-1">{service.summary}</p>
      <div className="d-flex flex-wrap gap-2 mb-3">{service.tags.map(t => <span className="badge bg-secondary-subtle text-secondary-emphasis" key={t}>{t}</span>)}</div>
      <button className="btn btn-outline-light" data-bs-toggle="collapse" data-bs-target={`#${id}`} onClick={()=>setOpen(!open)}>{open?'Hide Details':'View Details'}</button>
      <div className="collapse mt-3" id={id}><div className="p-3 rounded" style={{background:'#0f141b', border:'1px solid #1e2632'}}><p className="mb-0">{service.details}</p></div></div>
    </div>
  );
}
