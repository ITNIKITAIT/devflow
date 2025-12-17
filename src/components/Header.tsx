'use client';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import Container from './Container';
import Logo from './Logo';
import { Button } from './shared/button';

type HeaderProps = {
  user?: {
    name?: string | null;
    image?: string | null;
    username?: string | null;
  };
};

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/repositories" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>

          {user && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 pl-6 border-l border-border/50">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium leading-none text-foreground">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{user.username}</span>
                </div>

                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User avatar'}
                    width={36}
                    height={36}
                    className="rounded-full border border-border ring-2 ring-background"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-2 ring-background">
                    <User className="h-4 w-4" />
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => signOut()}
                  className="ml-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </nav>
      </Container>
    </header>
  );
}
