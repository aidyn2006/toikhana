import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { EmptyState, Seo, breadcrumbJsonLd } from '../components';
import { getBlogPosts } from '../api/client';

function formatDate(value?: string) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export function BlogPage() {
  const postsQuery = useQuery({ queryKey: ['blog'], queryFn: getBlogPosts });
  const posts = postsQuery.data ?? [];

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-8 md:py-10">
      <Seo
        title="Блог о тойханах и организации тоя | toikhana.kz"
        description="Статьи о выборе тойханы, ценах на свадьбу, организации торжеств в Казахстане. Советы и чек-листы."
        path="/blog"
        jsonLd={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: 'Блог', path: '/blog' }
        ])}
      />
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Блог</p>
        <h1 className="mt-3 font-serif text-4xl">Полезное об организации тоя</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Советы по выбору тойханы, ценам и подготовке к свадьбе, дню рождения и другим торжествам в Казахстане.
        </p>
      </section>

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-[1.75rem] bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/9] w-full bg-slate-100">
                {post.coverUrl ? (
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{formatDate(post.publishedAt)}</p>
                <h2 className="font-serif text-2xl leading-snug">{post.title}</h2>
                {post.excerpt ? <p className="text-sm leading-6 text-slate-600">{post.excerpt}</p> : null}
                <span className="inline-block pt-1 text-sm font-medium text-primary group-hover:underline">Читать →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="Статей пока нет" text="Загляните позже — мы готовим полезные материалы." />
      )}
    </main>
  );
}
