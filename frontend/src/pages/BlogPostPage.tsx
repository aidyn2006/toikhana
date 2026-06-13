import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { EmptyState, Seo, breadcrumbJsonLd, canonicalUrl } from '../components';
import { getBlogPost } from '../api/client';
import { useI18n } from '../i18n';

function formatDate(value: string | undefined, locale: string) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export function BlogPostPage() {
  const { t, lang } = useI18n();
  const dateLocale = lang === 'kk' ? 'kk-KZ' : 'ru-RU';
  const { slug = '' } = useParams();
  const postQuery = useQuery({ queryKey: ['blog', slug], queryFn: () => getBlogPost(slug), enabled: Boolean(slug) });
  const post = postQuery.data;

  if (postQuery.isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <Seo title="Статья не найдена | toikhana.kz" path={`/blog/${slug}`} noindex />
        <EmptyState title={t('blog.notFound')} text={t('blog.notFoundText')} />
        <Link to="/blog" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          {t('blog.back')}
        </Link>
      </main>
    );
  }

  if (!post) {
    return <main className="mx-auto max-w-3xl px-4 py-10 md:px-8" />;
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverUrl,
    datePublished: post.publishedAt,
    mainEntityOfPage: canonicalUrl(`/blog/${post.slug}`),
    author: { '@type': 'Organization', name: 'toikhana.kz' },
    publisher: { '@type': 'Organization', name: 'toikhana.kz' }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <Seo
        title={`${post.title} | toikhana.kz`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.coverUrl}
        type="article"
        jsonLd={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: 'Главная', path: '/' },
            { name: 'Блог', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` }
          ])
        ]}
      />
      <Link to="/blog" className="inline-block text-sm font-medium text-primary hover:underline">
        {t('blog.all')}
      </Link>
      <article className="space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(post.publishedAt, dateLocale)}</p>
          <h1 className="font-serif text-4xl leading-tight">{post.title}</h1>
          {post.excerpt ? <p className="text-lg leading-7 text-slate-600">{post.excerpt}</p> : null}
        </header>
        {post.coverUrl ? (
          <div className="aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-slate-100">
            <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
          </div>
        ) : null}
        <div className="whitespace-pre-line text-base leading-8 text-slate-700">{post.body}</div>
      </article>
    </main>
  );
}
