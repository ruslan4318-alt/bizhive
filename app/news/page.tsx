import Link from 'next/link';
import { supabase, type NewsArticle } from '@/lib/supabase';
import styles from './news.module.css';

// Sample data for development - will be replaced by Supabase
const sampleNews: NewsArticle[] = [
    {
        id: '1',
        slug: 'bizhive-partners-with-shopee',
        title: 'BIZHIVE Partners with Shopee for 2024 Campaign',
        excerpt: 'Exciting new partnership announcement to bring enhanced marketing solutions to Shopee sellers.',
        content: 'Full article content here...',
        image_url: null,
        published_at: '2024-01-15T00:00:00Z',
        created_at: '2024-01-15T00:00:00Z',
    },
    {
        id: '2',
        slug: 'new-studio-launch',
        title: 'New Live Commerce Studio Opening',
        excerpt: 'Expanding our capabilities with a state-of-the-art live streaming studio in Jakarta.',
        content: 'Full article content here...',
        image_url: null,
        published_at: '2024-01-10T00:00:00Z',
        created_at: '2024-01-10T00:00:00Z',
    },
    {
        id: '3',
        slug: 'tiktok-shop-milestone',
        title: 'Reaching 5,000 KOL Milestone on TikTok Shop',
        excerpt: 'A celebration of our growing network of managed influencers and content creators.',
        content: 'Full article content here...',
        image_url: null,
        published_at: '2024-01-05T00:00:00Z',
        created_at: '2024-01-05T00:00:00Z',
    },
    {
        id: '4',
        slug: 'quarterly-results-q4',
        title: 'Q4 2023 Results: Record-Breaking Performance',
        excerpt: 'BIZHIVE achieved unprecedented growth in the final quarter of 2023.',
        content: 'Full article content here...',
        image_url: null,
        published_at: '2024-01-02T00:00:00Z',
        created_at: '2024-01-02T00:00:00Z',
    },
    {
        id: '5',
        slug: 'content-creator-program',
        title: 'Launching Creator Development Program',
        excerpt: 'New initiative to support and develop content creators across Indonesia.',
        content: 'Full article content here...',
        image_url: null,
        published_at: '2023-12-20T00:00:00Z',
        created_at: '2023-12-20T00:00:00Z',
    },
    {
        id: '6',
        slug: 'year-end-celebration',
        title: 'BIZHIVE Year-End Celebration 2023',
        excerpt: 'Celebrating achievements and milestones with our team and partners.',
        content: 'Full article content here...',
        image_url: null,
        published_at: '2023-12-15T00:00:00Z',
        created_at: '2023-12-15T00:00:00Z',
    },
];

async function getNewsArticles(): Promise<NewsArticle[]> {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('published_at', { ascending: false });

        if (error || !data || data.length === 0) {
            // Return sample data if no data in Supabase
            return sampleNews;
        }

        return data as NewsArticle[];
    } catch {
        return sampleNews;
    }
}

export const metadata = {
    title: 'News & Updates - BIZHIVE',
    description: 'Latest news, updates, and announcements from BIZHIVE, your e-commerce marketing agency.',
};

export default async function NewsPage() {
    const articles = await getNewsArticles();

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>News & Updates</h1>
                    <p className={styles.subtitle}>
                        Stay updated with the latest announcements, campaigns, and achievements from BIZHIVE.
                    </p>
                </header>

                <div className={styles.grid}>
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/news/${article.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.cardImage}>
                                {article.image_url ? (
                                    <img src={article.image_url} alt={article.title} />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span>News</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardContent}>
                                <span className={styles.date}>
                                    {new Date(article.published_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                                <h2 className={styles.cardTitle}>{article.title}</h2>
                                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                                <span className={styles.readMore}>Read More →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
