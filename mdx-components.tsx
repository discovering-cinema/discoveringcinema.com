import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import YouTube from '@/app/components/YouTube';
import WrappedImage from '@/app/components/WrappedImage';
import FullWidth from '@/app/components/FullWidth';
import { Lede } from '@/app/components/Lede';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    YouTube,
    WrappedImage,
    FullWidth,
    Lede,
    a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href || ''} {...props}>
          {children}
        </Link>
      );
    },
  };
}
