import styles from './Services.module.css';

const services = [
    {
        id: 'store-optimization',
        title: 'Store Optimization',
        features: [
            'Website analysis',
            'Ads optimization',
            'Demographics setup',
            'Voucher & campaign marketing',
        ],
        highlight: '50+',
        highlightLabel: 'Brand Managers',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        id: 'content-production',
        title: 'Content Production',
        features: [
            'Content planning',
            'Content strategy',
            'Content production',
            'Content audit',
        ],
        highlight: '5,000+',
        highlightLabel: 'Content Videos',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
        ),
    },
    {
        id: 'affiliate-kol',
        title: 'Affiliate & KOL Management',
        features: [
            'Affiliate and influencer management',
            'Sales-based content execution',
        ],
        highlight: '5,000+',
        highlightLabel: 'Managed KOLs',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        id: 'live-streaming',
        title: 'Live Streaming',
        features: [
            'Live setting',
            'Live shopping operation',
            'Live strategy',
        ],
        highlight: '12+',
        highlightLabel: 'Studio Lives',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
            </svg>
        ),
    },
];

export default function Services() {
    return (
        <section id="services" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Services</h2>
                    <p className={styles.subtitle}>
                        Comprehensive e-commerce marketing solutions designed to drive growth
                        and maximize your brand&apos;s potential on major platforms.
                    </p>
                </div>
                <div className={styles.grid}>
                    {services.map((service) => (
                        <div key={service.id} className={styles.card}>
                            <div className={styles.cardIcon}>
                                {service.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <ul className={styles.cardFeatures}>
                                {service.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                            <div className={styles.cardHighlight}>
                                <span className={styles.highlightNumber}>{service.highlight}</span>
                                <span className={styles.highlightLabel}>{service.highlightLabel}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
