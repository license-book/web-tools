import type { MetadataRoute } from 'next';
import { categories, tools } from '@/data/tools';

const baseUrl = 'https://web-tools.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ['', '/about', '/privacy', '/terms', '/disclaimer', '/site-map', '/contact'];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.5,
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
