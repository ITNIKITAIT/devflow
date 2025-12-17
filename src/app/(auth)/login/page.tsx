'use client';
import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';

import Logo from '@/components/Logo';
import { Button } from '@/components/shared/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/shared/card';
import { Separator } from '@/components/shared/separator';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Logo showText={false} size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to Devflow to manage your technical debt</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={() => signIn('github', { callbackUrl: '/repositories' })}
            className="w-full gap-2 text-sm font-medium h-10"
            size="lg"
          >
            <Github className="h-5 w-5" />
            Sign in with GitHub
          </Button>

          <div className="relative flex items-center justify-center">
            <Separator className="w-full" />
            <div className="absolute bg-card px-2 text-xs uppercase text-muted-foreground">
              Required Permissions
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Access public and private repositories
              </li>
              <li className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                View email address
              </li>
              <li className="flex items-center justify-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Read profile information
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
