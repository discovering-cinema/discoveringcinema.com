import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://discoveringcinema.com';
const SITE_TITLE = 'Discovering Cinema';
const SITE_DESCRIPTION =
  'Thoughts on cinema, technology, and the invisible threads that connect them.';

export async function GET() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentDir);

  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContent);

      return {
        slug: file.replace(/\.mdx$/, ''),
        title: frontmatter.title || file.replace(/\.mdx$/, ''),
        date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
        description: frontmatter.description || '',
        image: frontmatter.image || '',
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

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

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/journal/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/journal/${post.slug}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
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
