import Link from 'next/link';
import styles from './caseStudies.module.css';

const caseStudies = [
    {
        slug: 'brand-a-shopee-optimization',
        title: 'Shopee Store Optimization',
        brand: 'Brand A',
        category: 'Cosmetic',
        platform: 'Shopee',
        duration: '1 Month',
        highlight: '+24.2% Sales Growth',
        description: 'Comprehensive store optimization resulting in significant sales and traffic increase.',
        results: [
            { label: 'Sales', value: '+24.2%' },
            { label: 'Visitors', value: '+31.7%' },
            { label: 'Orders', value: '+22.3%' },
        ],
        featured: true,
    },
    {
        slug: 'brand-b-tiktok-live',
        title: 'TikTok Live Commerce Launch',
        brand: 'Brand B',
        category: 'Fashion',
        platform: 'TikTok Shop',
        duration: '3 Months',
        highlight: '+150% GMV',
        description: 'Successful TikTok Shop launch with live streaming as the primary sales driver.',
        results: [
            { label: 'GMV', value: '+150%' },
            { label: 'Live Views', value: '+900%' },
            { label: 'Followers', value: '+750%' },
        ],
        featured: false,
    },
    {
        slug: 'brand-c-kol-campaign',
        title: 'Influencer Marketing Campaign',
        brand: 'Brand C',
        category: 'Beauty',
        platform: 'Shopee',
        duration: '2 Months',
        highlight: '+200% Followers',
        description: 'Strategic KOL partnerships driving brand awareness and engagement.',
        results: [
            { label: 'Followers', value: '+200%' },
            { label: 'Engagement', value: '+300%' },
            { label: 'KOL Sales', value: '+350%' },
        ],
        featured: false,
    },
    {
        slug: 'brand-d-viral-content',
        title: 'Viral Content Strategy',
        brand: 'Brand D',
        category: 'Lifestyle',
        platform: 'TikTok Shop',
        duration: '1 Month',
        highlight: '10M+ Views',
        description: 'Content strategy that generated viral videos and massive brand exposure.',
        results: [
            { label: 'Views', value: '10M+' },
            { label: 'Viral Videos', value: '5' },
            { label: 'Sales', value: '+300%' },
        ],
        featured: false,
    },
];

export default function CaseStudiesPage() {
    const featuredStudy = caseStudies.find(s => s.featured);
    const otherStudies = caseStudies.filter(s => !s.featured);

    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <span className={styles.badge}>📈 Case Studies</span>
                    <h1 className={styles.title}>
                        Proven Results, <span className={styles.highlight}>Real Growth</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Explore how we&apos;ve helped brands achieve remarkable e-commerce success 
                        through data-driven strategies and execution.
                    </p>
                </div>
            </section>

            {/* Featured Case Study */}
            {featuredStudy && (
                <section className={styles.featuredSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionLabel}>Featured Case Study</h2>
                        <Link href={`/clients/${featuredStudy.slug}`} className={styles.featuredCard}>
                            <div className={styles.featuredContent}>
                                <div className={styles.featuredTags}>
                                    <span className={styles.tagCategory}>{featuredStudy.category}</span>
                                    <span className={styles.tagPlatform}>{featuredStudy.platform}</span>
                                    <span className={styles.tagDuration}>{featuredStudy.duration}</span>
                                </div>
                                <h3 className={styles.featuredTitle}>{featuredStudy.title}</h3>
                                <p className={styles.featuredDescription}>{featuredStudy.description}</p>
                                <div className={styles.featuredResults}>
                                    {featuredStudy.results.map((result, index) => (
                                        <div key={index} className={styles.featuredResult}>
                                            <span className={styles.featuredResultValue}>{result.value}</span>
                                            <span className={styles.featuredResultLabel}>{result.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className={styles.featuredLink}>
                                    View Full Case Study
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                            <div className={styles.featuredHighlight}>
                                <span>{featuredStudy.highlight}</span>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Other Case Studies */}
            <section className={styles.gridSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionLabel}>More Success Stories</h2>
                    <div className={styles.grid}>
                        {otherStudies.map((study) => (
                            <Link
                                key={study.slug}
                                href={`/clients/${study.slug}`}
                                className={styles.card}
                            >
                                <div className={styles.cardTags}>
                                    <span className={styles.tagCategory}>{study.category}</span>
                                    <span className={styles.tagPlatform}>{study.platform}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{study.title}</h3>
                                <p className={styles.cardDescription}>{study.description}</p>
                                <div className={styles.cardResults}>
                                    {study.results.map((result, index) => (
                                        <div key={index} className={styles.cardResult}>
                                            <span className={styles.cardResultValue}>{result.value}</span>
                                            <span className={styles.cardResultLabel}>{result.label}</span>
                                        </div>
                                    ))}
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
