import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase, type NewsArticle } from '@/lib/supabase';
import styles from './article.module.css';

// Sample data for development
const sampleNews: NewsArticle[] = [
    {
        id: '1',
        slug: 'bizhive-partners-with-shopee',
        title: 'BIZHIVE Partners with Shopee for 2024 Campaign',
        excerpt: 'Exciting new partnership announcement to bring enhanced marketing solutions to Shopee sellers.',
        content: `
      <p>We are thrilled to announce our strategic partnership with Shopee for the 2024 marketing campaign season. This collaboration marks a significant milestone in our mission to empower e-commerce businesses across Indonesia.</p>
      
      <h2>What This Partnership Means</h2>
      <p>Through this partnership, BIZHIVE will gain access to enhanced tools and resources that will enable us to deliver even more impactful marketing solutions for our clients. Our team of brand managers will work closely with Shopee's platform team to optimize campaigns and drive better results.</p>
      
      <h2>Key Benefits for Our Clients</h2>
      <ul>
        <li>Priority access to new platform features</li>
        <li>Enhanced analytics and reporting tools</li>
        <li>Dedicated support channels</li>
        <li>Exclusive promotional opportunities</li>
      </ul>
      
      <p>We look forward to leveraging this partnership to create exceptional growth opportunities for all our clients in 2024 and beyond.</p>
    `,
        image_url: null,
        published_at: '2024-01-15T00:00:00Z',
        created_at: '2024-01-15T00:00:00Z',
    },
    {
        id: '2',
        slug: 'new-studio-launch',
        title: 'New Live Commerce Studio Opening',
        excerpt: 'Expanding our capabilities with a state-of-the-art live streaming studio in Jakarta.',
        content: `
      <p>BIZHIVE is proud to announce the opening of our newest live commerce studio in Jakarta. This state-of-the-art facility represents our commitment to providing the best possible live streaming experience for our clients.</p>
      
      <h2>Studio Features</h2>
      <p>Our new studio is equipped with professional-grade equipment including 4K cameras, studio lighting, and high-quality audio systems. The facility has been designed to accommodate various types of live commerce broadcasts.</p>
      
      <h2>Booking Information</h2>
      <p>The studio is now open for bookings. Contact our team to schedule your next live shopping session and experience the difference that professional production quality can make.</p>
    `,
        image_url: null,
        published_at: '2024-01-10T00:00:00Z',
        created_at: '2024-01-10T00:00:00Z',
    },
    {
        id: '3',
        slug: 'tiktok-shop-milestone',
        title: 'Reaching 5,000 KOL Milestone on TikTok Shop',
        excerpt: 'A celebration of our growing network of managed influencers and content creators.',
        content: `
      <p>We are excited to celebrate a major milestone: BIZHIVE has now grown our managed KOL network to over 5,000 influencers on TikTok Shop!</p>
      
      <h2>Growing Together</h2>
      <p>This achievement reflects the trust that content creators place in BIZHIVE as their partner for growth. Our dedicated affiliate management team works tirelessly to ensure each creator has the support they need to succeed.</p>
      
      <h2>Looking Ahead</h2>
      <p>We remain committed to expanding our network while maintaining the quality of support and service that has driven this growth. Thank you to all our creators and brand partners for being part of this journey.</p>
    `,
        image_url: null,
        published_at: '2024-01-05T00:00:00Z',
        created_at: '2024-01-05T00:00:00Z',
    },
];

async function getArticle(slug: string): Promise<NewsArticle | null> {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            // Fallback to sample data
            return sampleNews.find(article => article.slug === slug) || null;
        }

        return data as NewsArticle;
    } catch {
        return sampleNews.find(article => article.slug === slug) || null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return {
            title: 'Article Not Found - BIZHIVE',
        };
    }

    return {
        title: `${article.title} - BIZHIVE`,
        description: article.excerpt,
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <article className={styles.article}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Link href="/news" className={styles.backLink}>
                        ← Back to News
                    </Link>
                    <span className={styles.date}>
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                    <h1 className={styles.title}>{article.title}</h1>
                    <p className={styles.excerpt}>{article.excerpt}</p>
                </header>

                {article.image_url && (
                    <div className={styles.featuredImage}>
                        <img src={article.image_url} alt={article.title} />
                    </div>
                )}

                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: article.content || '' }}
                />

                <footer className={styles.footer}>
                    <Link href="/news" className={styles.backButton}>
                        ← Back to All News
                    </Link>
                </footer>
            </div>
        </article>
    );
}
