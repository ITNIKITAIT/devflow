import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-lg',
    md: 'h-10 w-10 text-xl',
    lg: 'h-12 w-12 text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-primary text-primary-foreground',
          sizeClasses[size]
        )}
      >
        <span className="font-bold">D</span>
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-foreground">Devflow</span>
      )}
    </div>
  );
}
