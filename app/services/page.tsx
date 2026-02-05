import Link from 'next/link';
import styles from './services.module.css';

const services = [
    {
        slug: 'shop-optimization',
        title: 'Shop Optimization',
        category: 'Performance',
        shortDescription: 'Maximize your e-commerce store performance with data-driven optimization strategies.',
        features: [
            'Website analysis & audit',
            'Ads optimization & targeting',
            'Demographics setup',
            'Voucher & campaign marketing',
        ],
        highlight: '50+',
        highlightLabel: 'Brand Managers',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        slug: 'content-production',
        title: 'Content Production',
        category: 'Creative',
        shortDescription: 'Create engaging content that drives sales and builds brand awareness.',
        features: [
            'Content planning & strategy',
            'Video production',
            'Content audit & optimization',
            'Multi-platform content',
        ],
        highlight: '5,000+',
        highlightLabel: 'Content Videos',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
        ),
    },
    {
        slug: 'affiliate-kol',
        title: 'Affiliate & KOL Management',
        category: 'Influencer',
        shortDescription: 'Leverage our network of influencers and affiliates to amplify your brand reach.',
        features: [
            'Affiliate program management',
            'Influencer recruitment & vetting',
            'Sales-based content execution',
            'Performance tracking',
        ],
        highlight: '5,000+',
        highlightLabel: 'Managed KOLs',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        slug: 'live-streaming',
        title: 'Live Streaming',
        category: 'Commerce',
        shortDescription: 'Drive real-time sales with professional live commerce streaming solutions.',
        features: [
            'Live setting & production',
            'Live shopping operation',
            'Live strategy & planning',
            'Host training & management',
        ],
        highlight: '12+',
        highlightLabel: 'Studio Lives',
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
            </svg>
        ),
    },
];

export default function ServicesPage() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <span className={styles.badge}>Our Services</span>
                    <h1 className={styles.title}>
                        Comprehensive <span className={styles.highlight}>E-Commerce Solutions</span>
                    </h1>
                    <p className={styles.subtitle}>
                        End-to-end marketing services designed to maximize your brand&apos;s 
                        potential on Shopee, TikTok Shop, and other major e-commerce platforms.
                    </p>
                </div>
            </section>

            <section className={styles.servicesSectionLight}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {services.map((service) => (
                            <Link
                                key={service.slug}
                                href={`/services/${service.slug}`}
                                className={styles.card}
                            >
                                <div className={styles.cardIcon}>{service.icon}</div>
                                <span className={styles.cardCategory}>{service.category}</span>
                                <h2 className={styles.cardTitle}>{service.title}</h2>
                                <p className={styles.cardDescription}>{service.shortDescription}</p>
                                <ul className={styles.cardFeatures}>
                                    {service.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                                <div className={styles.cardHighlight}>
                                    <span className={styles.highlightNumber}>{service.highlight}</span>
                                    <span className={styles.highlightLabel}>{service.highlightLabel}</span>
                                </div>
                                <span className={styles.cardLink}>
                                    Learn More
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
