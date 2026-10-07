'use client';

import Link from 'next/link';
import styles from './services.module.css';
import { AnimatedSection, StaggerContainer, StaggerItem, fadeInUp } from '@/components/animations';

export interface ServiceItem {
  id?: string;
  title: string;
  slug: string;
  category?: string | null;
  description: string;
  icon?: string | null;
  features: string[];
  highlight?: { number: string; label: string } | null;
}

export function renderServiceIcon(iconName?: string | null) {
  switch (iconName) {
    case 'video':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
          <rect x="2" y="6" width="14" height="12" rx="3" />
        </svg>
      );
    case 'users':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'live':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case 'chart':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
        </svg>
      );
    case 'target':
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'store':
    default:
      return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
  }
}

interface ServicesPageClientProps {
  services: ServiceItem[];
}

export default function ServicesPageClient({ services }: ServicesPageClientProps) {
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
                    {renderServiceIcon(service.icon)}
                  </div>
                  {service.category && (
                    <span className={styles.cardCategory}>{service.category}</span>
                  )}
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <ul className={styles.cardFeatures}>
                      {service.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  {service.highlight && (
                    <div className={styles.cardHighlight}>
                      <span className={styles.highlightNumber}>{service.highlight.number}</span>
                      <span className={styles.highlightLabel}>{service.highlight.label}</span>
                    </div>
                  )}
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
