'use server';

import Container from '@/components/Container';
import Header from '@/components/Header';
import { requireAuth } from '@/lib/auth';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  return (
    <>
      <Header user={session.user} />
      <Container>{children}</Container>
    </>
  );
}
