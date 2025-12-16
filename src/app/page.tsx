import Header from '@/components/Header';
import { requireAuth } from '@/lib/auth';

export default async function Home() {
  const session = await requireAuth();
  return <Header user={session.user} />;
}
