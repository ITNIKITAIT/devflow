import Header from '@/components/Header';
import ReposList from '@/components/ReposList';
import { requireAuth } from '@/lib/auth';

export default async function Home() {
  const session = await requireAuth();
  return (
    <>
      <Header user={session.user} />
      <ReposList />
    </>
  );
}
