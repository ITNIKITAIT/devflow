'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-600">DevFlow</h1>
          <p className="mt-2 text-gray-600">Technical Debt Tracking Platform</p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-white hover:bg-gray-800 cursor-pointer transition"
          >
            Sign in with GitHub
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>By signing in, you agree to allow access to:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>✓ Your public and private repositories</li>
            <li>✓ Your email address</li>
            <li>✓ Your profile information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
