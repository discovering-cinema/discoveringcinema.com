import type { MDXComponents } from 'mdx/types';
import { mdxComponents } from '@/app/components/MDXComponents';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
