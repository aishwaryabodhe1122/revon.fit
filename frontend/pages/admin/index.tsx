
import { useEffect } from 'react'; import { useRouter } from 'next/router';
export default function AdminIndex(){ const router=useRouter(); useEffect(()=>{ router.replace('/admin/contacts'); },[router]); return null; }
