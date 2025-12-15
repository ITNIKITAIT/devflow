import { requireAuth } from '@/lib/auth';

export default async function Home() {
  await requireAuth();
  return <button>Sign out</button>;
}
