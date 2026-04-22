import createMDX from '@next/mdx';
import { withContentCollections } from '@content-collections/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: false,
  },
  async redirects() {
    return [
      // Legacy slug redirects (pre-restructure)
      {
        source: '/journal/importance-of-physical-media-cinema-safety-net',
        destination:
          '/journal/physical-media/why-did-mid-budget-films-disappear',
        permanent: true,
      },
      {
        source:
          '/journal/importance-of-physical-media-the-end-of-accidental-preservation',
        destination:
          '/journal/physical-media/why-streaming-platforms-are-creating-a-film-preservation-crisis',
        permanent: true,
      },
      {
        source: '/journal/oprhan-films-night-of-the-living-dead',
        destination:
          '/journal/night-of-the-living-dead-how-a-legal-blunder-birthed-a-genre',
        permanent: true,
      },
      {
        source: '/journal/tag/:tag',
        destination: '/tags/:tag',
        permanent: true,
      },
      // Articles moved to series subdirectories
      {
        source: '/journal/why-did-mid-budget-films-disappear',
        destination:
          '/journal/physical-media/why-did-mid-budget-films-disappear',
        permanent: true,
      },
      {
        source: '/journal/the-collapse-of-the-long-tail',
        destination: '/journal/physical-media/the-collapse-of-the-long-tail',
        permanent: true,
      },
      {
        source:
          '/journal/why-streaming-platforms-are-creating-a-film-preservation-crisis',
        destination:
          '/journal/physical-media/why-streaming-platforms-are-creating-a-film-preservation-crisis',
        permanent: true,
      },
      {
        source: '/journal/when-streaming-platforms-rewrite-films',
        destination:
          '/journal/physical-media/when-streaming-platforms-rewrite-films',
        permanent: true,
      },
      {
        source:
          '/journal/uk-film-policy/why-uk-film-funding-is-not-supporting-british-films',
        destination:
          '/journal/a-cinema-of-our-own/why-uk-film-funding-is-not-supporting-british-films',
        permanent: true,
      },
      {
        source: '/journal/seven-degrees',
        destination: '/journal/the-open-cinema-project/seven-degrees',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-math'],
    rehypePlugins: ['rehype-slug', 'rehype-katex'],
  },
});

// Merge MDX config with Next.js config
const config = withMDX(nextConfig);
export default withContentCollections(config);
