import Link from 'next/link';
import styles from './clients.module.css';

const clients = [
    {
        slug: 'brand-cosmetic-a',
        name: 'Brand A',
        category: 'Cosmetic',
        platform: 'Shopee',
        description: 'Leading cosmetic brand with significant growth in online sales.',
        result: '+24.2% Sales',
    },
    {
        slug: 'brand-fashion-b',
        name: 'Brand B',
        category: 'Fashion',
        platform: 'TikTok Shop',
        description: 'Fashion brand successfully leveraging live commerce.',
        result: '+150% GMV',
    },
    {
        slug: 'brand-beauty-c',
        name: 'Brand C',
        category: 'Beauty',
        platform: 'Shopee',
        description: 'Beauty brand with strong influencer marketing presence.',
        result: '+200% Followers',
    },
    {
        slug: 'brand-lifestyle-d',
        name: 'Brand D',
        category: 'Lifestyle',
        platform: 'TikTok Shop',
        description: 'Lifestyle brand achieving viral content success.',
        result: '10M+ Views',
    },
    {
        slug: 'brand-health-e',
        name: 'Brand E',
        category: 'Health',
        platform: 'Shopee',
        description: 'Health brand with optimized store performance.',
        result: '+180% Orders',
    },
    {
        slug: 'brand-food-f',
        name: 'Brand F',
        category: 'Food & Beverage',
        platform: 'Shopee',
        description: 'F&B brand with successful campaign marketing.',
        result: '+300% Traffic',
    },
    {
        slug: 'brand-tech-g',
        name: 'Brand G',
        category: 'Tech',
        platform: 'TikTok Shop',
        description: 'Tech brand with effective live streaming sales.',
        result: '+120% Conversion',
    },
    {
        slug: 'brand-home-h',
        name: 'Brand H',
        category: 'Home & Living',
        platform: 'Shopee',
        description: 'Home brand with comprehensive store optimization.',
        result: '+90% Revenue',
    },
];

export default function ClientsPage() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <span className={styles.badge}>Our Clients</span>
                    <h1 className={styles.title}>
                        Trusted by <span className={styles.highlight}>Leading Brands</span>
                    </h1>
                    <p className={styles.subtitle}>
                        We&apos;ve helped national and international brands across beauty, lifestyle, 
                        and consumer goods categories achieve remarkable e-commerce growth.
                    </p>
                </div>
            </section>

            <section className={styles.clientsSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {clients.map((client) => (
                            <Link
                                key={client.slug}
                                href={`/clients/${client.slug}`}
                                className={styles.card}
                            >
                                <div className={styles.cardLogo}>
                                    <span>{client.name}</span>
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardTags}>
                                        <span className={styles.tagCategory}>{client.category}</span>
                                        <span className={styles.tagPlatform}>{client.platform}</span>
                                    </div>
                                    <h2 className={styles.cardName}>{client.name}</h2>
                                    <p className={styles.cardDescription}>{client.description}</p>
                                    <div className={styles.cardResult}>
                                        <span className={styles.resultNumber}>{client.result}</span>
                                    </div>
                                </div>
                                <span className={styles.cardLink}>
                                    View Case Study
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
