'use client';

import { MDXContent } from '@content-collections/mdx/react';
import { mdxComponents } from './MDXComponents';

export default function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={mdxComponents} />;
}
