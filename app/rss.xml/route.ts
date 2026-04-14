import { getAllPosts } from '@/app/lib/posts';

const SITE_URL = 'https://discoveringcinema.com';
const SITE_TITLE = 'Discovering Cinema';
const SITE_DESCRIPTION =
  'Thoughts on cinema, technology, and the invisible threads that connect them.';

export async function GET() {
  const posts = getAllPosts();

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <atom:link href="${SITE_URL}/rss.xml/" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map((post) => {
        const imageUrl = post.image ? `${SITE_URL}${post.image}` : '';
        const imageHtml = imageUrl
          ? `<p><img src="${imageUrl}" alt="${post.title}" /></p>`
          : '';
        const postDate = post.date || new Date();

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/journal/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/journal/${post.slug}</guid>
      <pubDate>${postDate.toUTCString()}</pubDate>
      <description><![CDATA[${imageHtml}${post.description}]]></description>
      ${
        imageUrl
          ? `<enclosure url="${imageUrl}" length="0" type="image/jpeg" />`
          : ''
      }
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
