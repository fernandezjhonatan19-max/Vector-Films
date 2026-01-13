import React, { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    {
                        'bg-surface-2 text-text': variant === 'default',
                        'bg-success/15 text-success border border-success/20': variant === 'success',
                        'bg-warning/15 text-warning border border-warning/20': variant === 'warning',
                        'bg-danger/15 text-danger border border-danger/20': variant === 'danger',
                        'text-text border border-border': variant === 'outline',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';
