import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './serviceDetail.module.css';

const servicesData: Record<string, {
    title: string;
    tagline: string;
    category: string;
    description: string;
    features: { title: string; description: string }[];
    process: { step: number; title: string; description: string }[];
    results: { number: string; label: string }[];
}> = {
    'store-optimization': {
        title: 'Store Optimization',
        tagline: 'Maximize your e-commerce store performance with data-driven strategies',
        category: 'Performance',
        description: 'Our Store Optimization service helps you unlock the full potential of your e-commerce store. We analyze every aspect of your online presence—from product listings to ad campaigns—and implement proven strategies to boost visibility, conversion rates, and overall sales performance.',
        features: [
            {
                title: 'Website Analysis & Audit',
                description: 'Comprehensive review of your store structure, product listings, and user experience to identify optimization opportunities.',
            },
            {
                title: 'Ads Optimization',
                description: 'Strategic ad placement and targeting to maximize ROAS and reach your ideal customers effectively.',
            },
            {
                title: 'Demographics Setup',
                description: 'Precise audience targeting based on demographics, interests, and shopping behavior patterns.',
            },
            {
                title: 'Voucher & Campaign Marketing',
                description: 'Strategic promotion planning for double days, pay days, and seasonal campaigns to maximize sales.',
            },
        ],
        process: [
            { step: 1, title: 'Audit', description: 'Complete store analysis and competitor research' },
            { step: 2, title: 'Strategy', description: 'Custom optimization plan development' },
            { step: 3, title: 'Implementation', description: 'Execute optimizations across all channels' },
            { step: 4, title: 'Monitor', description: 'Track performance and iterate for growth' },
        ],
        results: [
            { number: '24%', label: 'Average Sales Increase' },
            { number: '31%', label: 'Traffic Growth' },
            { number: '50+', label: 'Brands Optimized' },
        ],
    },
    'content-production': {
        title: 'Content Production',
        tagline: 'Create engaging content that drives sales and builds brand awareness',
        category: 'Creative',
        description: 'Our Content Production service delivers high-quality, platform-optimized content that captures attention and drives conversions. From product videos to lifestyle content, we create assets that tell your brand story and resonate with your target audience.',
        features: [
            {
                title: 'Content Planning & Strategy',
                description: 'Strategic content calendar aligned with platform trends, campaigns, and your business goals.',
            },
            {
                title: 'Video Production',
                description: 'Professional video content including product showcases, tutorials, and promotional clips.',
            },
            {
                title: 'Content Audit & Optimization',
                description: 'Analysis of existing content performance with recommendations for improvement.',
            },
            {
                title: 'Multi-Platform Adaptation',
                description: 'Content optimized for each platform—TikTok, Shopee, Instagram, and more.',
            },
        ],
        process: [
            { step: 1, title: 'Brief', description: 'Understand brand voice and content goals' },
            { step: 2, title: 'Create', description: 'Produce high-quality content assets' },
            { step: 3, title: 'Optimize', description: 'Adapt content for each platform' },
            { step: 4, title: 'Analyze', description: 'Track performance and refine strategy' },
        ],
        results: [
            { number: '5,000+', label: 'Videos Produced' },
            { number: '10M+', label: 'Total Views' },
            { number: '3x', label: 'Average Engagement Lift' },
        ],
    },
    'affiliate-kol': {
        title: 'Affiliate & KOL Management',
        tagline: 'Leverage influencer power to amplify your brand reach',
        category: 'Influencer',
        description: 'Our Affiliate & KOL Management service connects your brand with the right influencers and manages your affiliate program for maximum ROI. We handle everything from influencer recruitment to performance tracking and commission management.',
        features: [
            {
                title: 'Affiliate Program Management',
                description: 'End-to-end management of your affiliate network including recruitment, onboarding, and payouts.',
            },
            {
                title: 'Influencer Recruitment & Vetting',
                description: 'Identify and vet influencers that align with your brand values and target audience.',
            },
            {
                title: 'Sales-Based Content Execution',
                description: 'Performance-driven content campaigns with measurable sales outcomes.',
            },
            {
                title: 'Performance Tracking',
                description: 'Real-time dashboards and reports to monitor KOL performance and ROI.',
            },
        ],
        process: [
            { step: 1, title: 'Match', description: 'Find the right influencers for your brand' },
            { step: 2, title: 'Brief', description: 'Align on campaign goals and content' },
            { step: 3, title: 'Execute', description: 'Launch and manage campaigns' },
            { step: 4, title: 'Report', description: 'Analyze results and optimize' },
        ],
        results: [
            { number: '5,000+', label: 'Managed KOLs' },
            { number: '1,000+', label: 'Creator Portfolio' },
            { number: '150%', label: 'Average ROAS' },
        ],
    },
    'live-streaming': {
        title: 'Live Streaming',
        tagline: 'Drive real-time sales with professional live commerce',
        category: 'Commerce',
        description: 'Our Live Streaming service provides everything you need for successful live commerce—from professional studio facilities to trained hosts and strategic planning. We help you engage customers in real-time and convert viewers into buyers.',
        features: [
            {
                title: 'Live Setting & Production',
                description: 'Professional studio setup with high-quality lighting, cameras, and streaming equipment.',
            },
            {
                title: 'Live Shopping Operation',
                description: 'End-to-end live commerce operations including product staging and order management.',
            },
            {
                title: 'Live Strategy & Planning',
                description: 'Strategic session planning aligned with campaigns, promotions, and peak shopping times.',
            },
            {
                title: 'Host Training & Management',
                description: 'Professional host training and management for engaging, sales-driven streams.',
            },
        ],
        process: [
            { step: 1, title: 'Plan', description: 'Develop streaming strategy and schedule' },
            { step: 2, title: 'Prepare', description: 'Set up studio and train hosts' },
            { step: 3, title: 'Stream', description: 'Execute professional live sessions' },
            { step: 4, title: 'Optimize', description: 'Analyze and improve performance' },
        ],
        results: [
            { number: '12+', label: 'Studio Facilities' },
            { number: '500+', label: 'Live Sessions' },
            { number: '5x', label: 'Conversion vs Static' },
        ],
    },
};

export async function generateStaticParams() {
    return Object.keys(servicesData).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = servicesData[slug];

    if (!service) {
        notFound();
    }

    return (
        <main className={styles.main}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <nav className={styles.breadcrumb}>
                        <Link href="/services">Services</Link>
                        <span>/</span>
                        <span>{service.title}</span>
                    </nav>
                    <span className={styles.badge}>{service.category}</span>
                    <h1 className={styles.title}>{service.title}</h1>
                    <p className={styles.tagline}>{service.tagline}</p>
                </div>
            </section>

            {/* Overview */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>What We Offer</h2>
                    <p className={styles.description}>{service.description}</p>
                </div>
            </section>

            {/* Features */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Key Features</h2>
                    <div className={styles.featuresGrid}>
                        {service.features.map((feature, index) => (
                            <div key={index} className={styles.featureCard}>
                                <div className={styles.featureNumber}>{String(index + 1).padStart(2, '0')}</div>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDescription}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <div className={styles.processGrid}>
                        {service.process.map((step) => (
                            <div key={step.step} className={styles.processStep}>
                                <div className={styles.stepNumber}>{step.step}</div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Expected Results</h2>
                    <div className={styles.resultsGrid}>
                        {service.results.map((result, index) => (
                            <div key={index} className={styles.resultCard}>
                                <span className={styles.resultNumber}>{result.number}</span>
                                <span className={styles.resultLabel}>{result.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
                    <p className={styles.ctaDescription}>
                        Let&apos;s discuss how {service.title} can help grow your business.
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
                        <Link href="/services" className={styles.btnSecondary}>
                            View All Services
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
