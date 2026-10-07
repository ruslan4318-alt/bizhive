'use client';

import Link from 'next/link';
import styles from './serviceDetail.module.css';
import { AnimatedSection, StaggerContainer, StaggerItem, CountUp, fadeInUp, scaleIn } from '@/components/animations';

export interface ServiceDetailData {
  title: string;
  tagline: string;
  category: string;
  description: string;
  features: { title: string; description: string }[];
  process: { step: number; title: string; description: string }[];
  results: { number: string; label: string; suffix?: string }[];
}

interface ServiceDetailClientProps {
  service: ServiceDetailData;
  slug: string;
}

export default function ServiceDetailClient({ service, slug }: ServiceDetailClientProps) {
  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <AnimatedSection variants={fadeInUp}>
            <nav className={styles.breadcrumb}>
              <Link href="/services">Services</Link>
              <span>/</span>
              <span>{service.title}</span>
            </nav>
            <span className={styles.badge}>{service.category}</span>
            <h1 className={styles.title}>{service.title}</h1>
            <p className={styles.tagline}>{service.tagline}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Overview */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className={styles.container}>
          <AnimatedSection delay={0.2}>
            <h2 className={styles.sectionTitle}>What We Offer</h2>
            <p className={styles.description}>{service.description}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <AnimatedSection>
              <h2 className={styles.sectionTitle}>Key Features</h2>
            </AnimatedSection>
            <StaggerContainer className={styles.featuresGrid}>
              {service.features.map((feature, index) => (
                <StaggerItem key={index} className={styles.featureCard}>
                  <div className={styles.featureNumber}>{String(index + 1).padStart(2, '0')}</div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Process */}
      {service.process && service.process.length > 0 && (
        <section className={`${styles.section} ${styles.sectionLight}`}>
          <div className={styles.container}>
            <AnimatedSection>
              <h2 className={styles.sectionTitle}>How It Works</h2>
            </AnimatedSection>
            <StaggerContainer className={styles.processGrid}>
              {service.process.map((step) => (
                <StaggerItem key={step.step} className={styles.processStep}>
                  <div className={styles.stepNumber}>{step.step}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Results */}
      {service.results && service.results.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <AnimatedSection>
              <h2 className={styles.sectionTitle}>Expected Results</h2>
            </AnimatedSection>
            <StaggerContainer className={styles.resultsGrid}>
              {service.results.map((result, index) => (
                <StaggerItem key={index} className={styles.resultCard}>
                  <CountUp 
                    target={parseInt(result.number) || 100} 
                    suffix={result.suffix || ''} 
                    className={styles.resultNumber} 
                  />
                  <span className={styles.resultLabel}>{result.label}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <AnimatedSection variants={scaleIn} delay={0.4} className="flex justify-center mt-12">
              <Link 
                href="/clients" 
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                View Success Stories
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <AnimatedSection variants={scaleIn}>
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
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
