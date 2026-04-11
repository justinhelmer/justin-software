import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { latestPosts } from '../lib/config';

export async function GET(context: APIContext) {
  const posts = await getCollection('writing');
  const sorted = latestPosts(posts);

  return rss({
    title: 'justin.software',
    description: 'Writing by Justin Helmer — systems, infrastructure, engineering.',
    site: context.site!,
    items: sorted.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/writing/${post.id}/`,
    })),
  });
}
