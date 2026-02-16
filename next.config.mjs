import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: '/journal/importance-of-physical-media-cinema-safety-net',
        destination: '/journal/why-did-mid-budget-films-disappear',
        permanent: true,
      },
      {
        source:
          '/journal/importance-of-physical-media-the-end-of-accidental-preservation',
        destination:
          '/journal/why-streaming-platforms-are-creating-a-film-preservation-crisis',
        permanent: true,
      },
      {
        source: '/journal/oprhan-films-night-of-the-living-dead',
        destination:
          '/journal/night-of-the-living-dead-how-a-legal-blunder-birthed-a-genre',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-math'],
    rehypePlugins: ['rehype-katex'],
  },
});

// Merge MDX config with Next.js config
const config = withMDX(nextConfig);
export default config;
