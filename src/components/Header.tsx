'use client';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

type HeaderProps = {
  user?: {
    name?: string | null;
    image?: string | null;
  };
};

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="text-xl font-semibold">Devflow</div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {user.image && (
              <Image
                src={user.image}
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="text-sm font-medium">{user.name}</span>
          </div>

          <LogOut className="h-5 w-5 cursor-pointer" onClick={() => signOut()} />
        </div>
      )}
    </header>
  );
}
