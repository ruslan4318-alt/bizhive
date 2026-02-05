'use client';

import Link from 'next/link';
import styles from './services.module.css';
import { AnimatedSection, StaggerContainer, StaggerItem, fadeInUp } from '@/components/animations';

const services = [
    {
        title: 'Shop Optimization',
        slug: 'shop-optimization',
        category: 'Performance',
        description: 'Maximize your e-commerce store performance with data-driven strategies and precise targeting.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
        ),
        features: ['Website Analysis', 'Ads Optimization', 'Campaign Marketing'],
        highlight: { number: '24%', label: 'Revenue Lift' }
    },
    {
        title: 'Content Production',
        slug: 'content-production',
        category: 'Creative',
        description: 'Engaging product videos and lifestyle content optimized for TikTok, Shopee, and Instagram.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
                <rect x="2" y="6" width="14" height="12" rx="3" />
            </svg>
        ),
        features: ['Video Production', 'Content Strategy', 'Multi-Platform adaptation'],
        highlight: { number: '5k+', label: 'Videos Made' }
    },
    {
        title: 'Affiliate & KOL',
        slug: 'affiliate-kol',
        category: 'Influencer',
        description: 'Performance-driven influencer marketing and affiliate network management.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        features: ['Influencer Vetting', 'Performance Tracking', 'Program Management'],
        highlight: { number: '5k+', label: 'Active KOLs' }
    },
    {
        title: 'Live Streaming',
        slug: 'live-streaming',
        category: 'Commerce',
        description: 'Professional live shop operation with trained hosts and state-of-the-art studio facilities.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" /><path d="M2 12a9 9 0 0 1 8 8" /><path d="M2 16a5 5 0 0 1 4 4" /><circle cx="2" cy="20" r="1" />
            </svg>
        ),
        features: ['Professional Hosts', 'Studio Rental', 'Strategic Planning'],
        highlight: { number: '12+', label: 'Live Studios' }
    }
];

export default function ServicesPage() {
    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <AnimatedSection variants={fadeInUp}>
                        <span className={styles.badge}>Our Expertise</span>
                        <h1 className={styles.title}>
                            Comprehensive <span className={styles.highlight}>Digital Solutions</span>
                        </h1>
                        <p className={styles.subtitle}>
                            We provide end-to-end services to help your brand thrive in the digital landscape, 
                            from optimization and content to influencer management and live commerce.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            <section className={styles.servicesSectionLight}>
                <div className={styles.container}>
                    <StaggerContainer className={styles.grid}>
                        {services.map((service) => (
                            <StaggerItem key={service.slug}>
                                <Link href={`/services/${service.slug}`} className={styles.card}>
                                    <div className={styles.cardIcon}>
                                        {service.icon}
                                    </div>
                                    <span className={styles.cardCategory}>{service.category}</span>
                                    <h3 className={styles.cardTitle}>{service.title}</h3>
                                    <p className={styles.cardDescription}>{service.description}</p>
                                    <ul className={styles.cardFeatures}>
                                        {service.features.map((feature, i) => (
                                            <li key={i}>{feature}</li>
                                        ))}
                                    </ul>
                                    <div className={styles.cardHighlight}>
                                        <span className={styles.highlightNumber}>{service.highlight.number}</span>
                                        <span className={styles.highlightLabel}>{service.highlight.label}</span>
                                    </div>
                                    <div className={styles.cardLink}>
                                        Explore Service
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>
        </main>
    );
}
