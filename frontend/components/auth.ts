
export function getToken(){ if(typeof window==='undefined') return null; return localStorage.getItem('Revvon.Fit_token'); }
export function setToken(t:string){ if(typeof window==='undefined') return; localStorage.setItem('Revvon.Fit_token', t); }
export function authHeaders(){ const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {}; }
