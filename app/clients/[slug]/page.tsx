import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './clientDetail.module.css';

const clientsData: Record<string, {
    name: string;
    category: string;
    platform: string;
    duration: string;
    challenge: string;
    solution: string[];
    results: { metric: string; before: string; after: string; growth: string }[];
    services: string[];
}> = {
    'brand-cosmetic-a': {
        name: 'Brand A',
        category: 'Cosmetic',
        platform: 'Shopee',
        duration: '1 Month',
        challenge: 'Brand A was struggling with stagnant sales and low visibility on Shopee despite having quality products. Their store lacked proper optimization and their ad campaigns were not reaching the right audience.',
        solution: [
            'Comprehensive store audit and restructuring',
            'Ads optimization with precise demographic targeting',
            'Voucher and campaign strategy for Double Day events',
            'Content refresh with product-focused visuals',
        ],
        results: [
            { metric: 'Sales', before: 'Rp 7.6M', after: 'Rp 9.4M', growth: '+24.2%' },
            { metric: 'Visitors', before: '977,958', after: '1,288,169', growth: '+31.7%' },
            { metric: 'Orders', before: '37,569', after: '45,932', growth: '+22.3%' },
        ],
        services: ['Store Optimization', 'Ads Management', 'Campaign Marketing'],
    },
    'brand-fashion-b': {
        name: 'Brand B',
        category: 'Fashion',
        platform: 'TikTok Shop',
        duration: '3 Months',
        challenge: 'Brand B wanted to expand their presence on TikTok Shop but lacked experience with live commerce and influencer marketing on the platform.',
        solution: [
            'TikTok Shop store setup and optimization',
            'Live streaming strategy and host training',
            'KOL partnership program development',
            'Content production for TikTok format',
        ],
        results: [
            { metric: 'GMV', before: 'Rp 50M', after: 'Rp 125M', growth: '+150%' },
            { metric: 'Live Views', before: '5,000', after: '50,000', growth: '+900%' },
            { metric: 'Followers', before: '10K', after: '85K', growth: '+750%' },
        ],
        services: ['Live Streaming', 'Affiliate & KOL', 'Content Production'],
    },
    'brand-beauty-c': {
        name: 'Brand C',
        category: 'Beauty',
        platform: 'Shopee',
        duration: '2 Months',
        challenge: 'Brand C needed to build brand awareness and drive sales through influencer partnerships but struggled to find and manage the right KOLs.',
        solution: [
            'KOL recruitment and vetting process',
            'Affiliate program setup and management',
            'Sales-based content campaign execution',
            'Performance tracking and optimization',
        ],
        results: [
            { metric: 'Followers', before: '25K', after: '75K', growth: '+200%' },
            { metric: 'Engagement', before: '2%', after: '8%', growth: '+300%' },
            { metric: 'Sales via KOL', before: 'Rp 10M', after: 'Rp 45M', growth: '+350%' },
        ],
        services: ['Affiliate & KOL', 'Content Production'],
    },
    'brand-lifestyle-d': {
        name: 'Brand D',
        category: 'Lifestyle',
        platform: 'TikTok Shop',
        duration: '1 Month',
        challenge: 'Brand D had great products but their content wasn\'t performing well on TikTok. They needed viral-worthy content to drive awareness.',
        solution: [
            'Content strategy aligned with TikTok trends',
            'Video production with hook-focused approach',
            'Creator collaboration for authentic content',
            'Optimization based on performance data',
        ],
        results: [
            { metric: 'Total Views', before: '500K', after: '10M+', growth: '+1900%' },
            { metric: 'Viral Videos', before: '0', after: '5', growth: 'New' },
            { metric: 'Sales', before: 'Rp 20M', after: 'Rp 80M', growth: '+300%' },
        ],
        services: ['Content Production', 'Affiliate & KOL'],
    },
    'brand-health-e': {
        name: 'Brand E',
        category: 'Health',
        platform: 'Shopee',
        duration: '2 Months',
        challenge: 'Brand E\'s store was underperforming due to poor product listings and ineffective ad targeting in the competitive health category.',
        solution: [
            'Product listing optimization with SEO focus',
            'Store layout and navigation improvement',
            'Targeted ads campaign for health-conscious audience',
            'Review management and social proof building',
        ],
        results: [
            { metric: 'Orders', before: '500/mo', after: '1,400/mo', growth: '+180%' },
            { metric: 'Conversion Rate', before: '1.2%', after: '3.5%', growth: '+192%' },
            { metric: 'Revenue', before: 'Rp 25M', after: 'Rp 70M', growth: '+180%' },
        ],
        services: ['Store Optimization', 'Ads Management'],
    },
    'brand-food-f': {
        name: 'Brand F',
        category: 'Food & Beverage',
        platform: 'Shopee',
        duration: '1 Month',
        challenge: 'Brand F was missing out on major campaign opportunities and needed a strategic approach to Double Day and Pay Day promotions.',
        solution: [
            'Campaign calendar planning and preparation',
            'Voucher strategy optimization',
            'Flash sale and bundle deal execution',
            'Traffic driving through multiple channels',
        ],
        results: [
            { metric: 'Traffic', before: '10K/day', after: '40K/day', growth: '+300%' },
            { metric: 'Campaign Sales', before: 'Rp 30M', after: 'Rp 150M', growth: '+400%' },
            { metric: 'New Customers', before: '500', after: '2,500', growth: '+400%' },
        ],
        services: ['Store Optimization', 'Campaign Marketing'],
    },
    'brand-tech-g': {
        name: 'Brand G',
        category: 'Tech',
        platform: 'TikTok Shop',
        duration: '2 Months',
        challenge: 'Brand G wanted to leverage live streaming for their tech products but lacked the infrastructure and expertise to execute effectively.',
        solution: [
            'Studio setup with tech demo capabilities',
            'Host training for technical product presentation',
            'Live streaming schedule optimization',
            'Product demonstration script development',
        ],
        results: [
            { metric: 'Conversion Rate', before: '0.5%', after: '1.1%', growth: '+120%' },
            { metric: 'Average Order', before: 'Rp 500K', after: 'Rp 750K', growth: '+50%' },
            { metric: 'Live Sales', before: 'Rp 5M', after: 'Rp 25M', growth: '+400%' },
        ],
        services: ['Live Streaming', 'Content Production'],
    },
    'brand-home-h': {
        name: 'Brand H',
        category: 'Home & Living',
        platform: 'Shopee',
        duration: '3 Months',
        challenge: 'Brand H\'s comprehensive product catalog was poorly organized, leading to low discoverability and poor conversion rates.',
        solution: [
            'Full store restructuring and categorization',
            'Product photography and listing enhancement',
            'Bundle strategy for home collections',
            'Customer journey optimization',
        ],
        results: [
            { metric: 'Revenue', before: 'Rp 100M', after: 'Rp 190M', growth: '+90%' },
            { metric: 'Average Cart', before: 'Rp 200K', after: 'Rp 350K', growth: '+75%' },
            { metric: 'Return Rate', before: '8%', after: '3%', growth: '-63%' },
        ],
        services: ['Store Optimization', 'Content Production'],
    },
};

export async function generateStaticParams() {
    return Object.keys(clientsData).map((slug) => ({ slug }));
}

export default async function ClientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const client = clientsData[slug];

    if (!client) {
        notFound();
    }

    return (
        <main className={styles.main}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <nav className={styles.breadcrumb}>
                        <Link href="/clients">Clients</Link>
                        <span>/</span>
                        <span>Case Study</span>
                    </nav>
                    <div className={styles.heroContent}>
                        <div className={styles.logoPlaceholder}>
                            <span>{client.name}</span>
                        </div>
                        <div className={styles.heroInfo}>
                            <div className={styles.tags}>
                                <span className={styles.tagCategory}>{client.category}</span>
                                <span className={styles.tagPlatform}>{client.platform}</span>
                                <span className={styles.tagDuration}>{client.duration}</span>
                            </div>
                            <h1 className={styles.title}>{client.name} Case Study</h1>
                            <div className={styles.services}>
                                {client.services.map((service, index) => (
                                    <span key={index} className={styles.serviceTag}>{service}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenge */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>The Challenge</h2>
                    <p className={styles.challengeText}>{client.challenge}</p>
                </div>
            </section>

            {/* Solution */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Our Solution</h2>
                    <ul className={styles.solutionList}>
                        {client.solution.map((item, index) => (
                            <li key={index}>
                                <span className={styles.solutionNumber}>{index + 1}</span>
                                <span className={styles.solutionText}>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Results */}
            <section className={styles.resultsSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>The Results</h2>
                    <div className={styles.resultsGrid}>
                        {client.results.map((result, index) => (
                            <div key={index} className={styles.resultCard}>
                                <span className={styles.resultMetric}>{result.metric}</span>
                                <div className={styles.resultComparison}>
                                    <div className={styles.resultBefore}>
                                        <span className={styles.resultLabel}>Before</span>
                                        <span className={styles.resultValue}>{result.before}</span>
                                    </div>
                                    <div className={styles.resultArrow}>→</div>
                                    <div className={styles.resultAfter}>
                                        <span className={styles.resultLabel}>After</span>
                                        <span className={styles.resultValue}>{result.after}</span>
                                    </div>
                                </div>
                                <span className={styles.resultGrowth}>{result.growth}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <h2 className={styles.ctaTitle}>Want Similar Results?</h2>
                    <p className={styles.ctaDescription}>
                        Let&apos;s discuss how we can help your brand achieve remarkable growth.
                    </p>
                    <div className={styles.ctaButtons}>
                        <a
                            href="https://wa.me/6281250493122"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnPrimary}
                        >
                            Contact via WhatsApp
                        </a>
                        <Link href="/clients" className={styles.btnSecondary}>
                            View More Case Studies
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
