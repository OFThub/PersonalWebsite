import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title,
  description,
  image = '/og-image.jpg',
  url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  type = 'website',
  keywords = [],
  author,
  publishedTime,
  modifiedTime
}: SEOProps): Metadata {
  const siteName = 'Portfolio - Your Name';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime })
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: author ? `@${author}` : undefined
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: url
    }
  };
}

export function generateStructuredData(type: 'person' | 'article' | 'website', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (type === 'person') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      url: baseUrl,
      image: data.image,
      sameAs: [
        data.github,
        data.linkedin,
        data.twitter
      ].filter(Boolean),
      jobTitle: data.jobTitle,
      description: data.description
    };
  }

  if (type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      image: data.image,
      author: {
        '@type': 'Person',
        name: data.authorName
      },
      publisher: {
        '@type': 'Organization',
        name: 'Portfolio',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      },
      datePublished: data.publishedAt,
      dateModified: data.updatedAt
    };
  }

  if (type === 'website') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name,
      url: baseUrl,
      description: data.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  return null;
}