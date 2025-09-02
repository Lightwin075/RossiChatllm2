
'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  variant?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variantClasses = {
  gray: 'bg-gray-100 text-gray-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  purple: 'bg-purple-100 text-purple-800',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
};

export default function Badge({
  variant = 'gray',
  size = 'sm',
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {children}
    </span>
  );
}
