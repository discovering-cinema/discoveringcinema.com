import * as React from 'react';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import YouTube from '@/app/components/YouTube';
import WrappedImage from '@/app/components/WrappedImage';
import FullWidth from '@/app/components/FullWidth';
import { Lede } from '@/app/components/Lede';
import Quiz from '@/app/components/Quiz';
import UKFilmSpendChart from '@/app/components/UKFilmSpendChart';
import BFILoopholeCalculator from '@/app/components/BFILoopholeCalculator';

export const mdxComponents: MDXComponents = {
  YouTube,
  WrappedImage,
  FullWidth,
  Lede,
  Quiz,
  UKFilmSpendChart,
  BFILoopholeCalculator,
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
