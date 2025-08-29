import Head from 'next/head'; import Link from 'next/link';

export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
  return (<>
    <Head><title>{title ? `${title} | Revvon.Fit` : 'Revvon.Fit — Premium Fitness & Nutrition'}</title></Head>
    <nav className="navbar navbar-expand-lg sticky-top"><div className="container">
      <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
        <img src="/assets/logo.svg" alt="logo" width={32} height={32} /><span className="fw-bold">Revvon.Fit</span>
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"></span></button>
      <div className="collapse navbar-collapse" id="nav">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-3">
          <li className="nav-item"><Link className="nav-link" href="/services">Services</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/blogs">Blogs</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/contact">Contact</Link></li>
        </ul>
        <ul className="navbar-nav ms-2">
          <li className="nav-item"><Link className="btn btn-outline-light" href="/admin/login">Admin</Link></li>
        </ul>
      </div>
    </div></nav>
    <main>{children}</main>
    <footer className="footer py-4 mt-5"><div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
      <div className="d-flex align-items-center gap-2"><img src="/assets/logo.svg" alt="logo" width={20} height={20} /><span className="text-secondary">© {new Date().getFullYear()} Revvon.Fit</span></div>
      <div className="d-flex gap-3"><a href="#" className="text-secondary">Privacy</a><a href="#" className="text-secondary">Terms</a></div>
      <div className='text-secondary'>Proudly Created By <span className='service-company' style={{ color: '#fff', fontWeight: 'bold', fontStyle: 'italic', fontSize: '1.2rem' }}>Aishwarya & Sushil</span></div>
    </div></footer>
  </>);
}
