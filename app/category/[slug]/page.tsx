import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { categories, getCategoryTools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};
  return { title: `${category.name} 도구`, description: category.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const categoryTools = getCategoryTools(slug);

  return (
    <main>
      <section className="toolHero">
        <div className="container">
          <span className="eyebrow">TOOL CATEGORY</span>
          <h1>{category.name} 도구</h1>
          <p>{category.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="toolGrid">
            {categoryTools.length > 0 ? categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />) : <p>도구를 준비하고 있습니다.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
