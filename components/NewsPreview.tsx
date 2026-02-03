import Link from 'next/link';
import styles from './NewsPreview.module.css';

// Sample news data - this will be replaced by Supabase data
const sampleNews = [
    {
        id: '1',
        slug: 'bizhive-partners-with-shopee',
        title: 'BIZHIVE Partners with Shopee for 2024 Campaign',
        excerpt: 'Exciting new partnership announcement to bring enhanced marketing solutions to Shopee sellers.',
        image_url: null,
        published_at: '2024-01-15',
    },
    {
        id: '2',
        slug: 'new-studio-launch',
        title: 'New Live Commerce Studio Opening',
        excerpt: 'Expanding our capabilities with a state-of-the-art live streaming studio in Jakarta.',
        image_url: null,
        published_at: '2024-01-10',
    },
    {
        id: '3',
        slug: 'tiktok-shop-milestone',
        title: 'Reaching 5,000 KOL Milestone on TikTok Shop',
        excerpt: 'A celebration of our growing network of managed influencers and content creators.',
        image_url: null,
        published_at: '2024-01-05',
    },
];

export default function NewsPreview() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>News & Updates</h2>
                    <Link href="/news" className={styles.viewAll}>
                        View All News →
                    </Link>
                </div>
                <div className={styles.grid}>
                    {sampleNews.map((article) => (
                        <Link
                            key={article.id}
                            href={`/news/${article.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.cardImage}>
                                <div className={styles.imagePlaceholder}>
                                    <span>News</span>
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <span className={styles.date}>
                                    {new Date(article.published_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                                <h3 className={styles.cardTitle}>{article.title}</h3>
                                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
