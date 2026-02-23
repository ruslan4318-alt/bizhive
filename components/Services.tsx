import styles from './Services.module.css';

const services = [
    {
        id: 'shop-optimization',
        title: 'Shop Optimization',
        description: 'Maximize your store visibility and conversion rates with data-driven optimization strategies.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        id: 'content-production',
        title: 'Content Production',
        description: 'High-quality product photography, videos, and creative content that sells.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
        ),
    },
    {
        id: 'live-streaming',
        title: 'Live Streaming',
        description: 'Professional live commerce execution with trained hosts and optimized setups.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
        ),
    },
    {
        id: 'affiliate-kol',
        title: 'Affiliate & KOL',
        description: 'Connect with 5,000+ managed KOLs and affiliates for maximum reach.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

export default function Services() {
    return (
        <section id="services" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Comprehensive E-Commerce Solutions</h2>
                    <p className={styles.subtitle}>
                        End-to-end marketing services designed to accelerate your growth on every major platform.
                    </p>
                </div>
                <div className={styles.grid}>
                    {services.map((service) => (
                        <div key={service.id} className={styles.card}>
                            <div className={styles.cardIcon}>
                                {service.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDescription}>
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
