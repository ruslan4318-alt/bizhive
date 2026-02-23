import { motion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from './animations';
import styles from './JoinProgram.module.css';

export default function JoinProgram() {
    return (
        <section className={styles.section} id="join">
            {/* Background Decorative Elements */}
            <div className={styles.bgDecoration}>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>
            </div>

            <div className={styles.container}>
                <header className={styles.header}>
                    <AnimatedSection>
                        <span className={styles.badge}>
                            <motion.span 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🚀
                            </motion.span>
                            Get Started
                        </span>
                        <h2 className={styles.title}>
                            Ready to <span className={styles.highlight}>Grow Together?</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Choose the path that fits your journey. Whether you want to collaborate or learn, 
                            we&apos;re here to help you succeed in e-commerce.
                        </p>
                    </AnimatedSection>
                </header>

                <StaggerContainer className={styles.cards}>
                    {/* Collabs Card */}
                    <StaggerItem>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div className={styles.cardBadge}>Partnership</div>
                            <h3 className={styles.cardTitle}>Collabs with Us</h3>
                            <p className={styles.cardDescription}>
                                Join our network of brands, influencers, and content creators to scale your 
                                e-commerce presence on TikTok Shop &amp; Shopee.
                            </p>
                            <ul className={styles.cardFeatures}>
                                {[
                                    'Brand Partnership Opportunities',
                                    'Access to Our MCN Network',
                                    'Strategic Marketing Support',
                                    'Creative Campaign Collaboration'
                                ].map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <div className={styles.featureCheck}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <motion.a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfm9Q549Rgidcn9iVpHhFptf3S4Bj-7JGMm0W5meWv7DDnrdA/viewform?usp=dialog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnPrimary}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start Collaboration
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </motion.a>
                        </div>
                    </StaggerItem>

                    {/* Free Training Card */}
                    <StaggerItem>
                        <div className={`${styles.card} ${styles.cardFeatured}`}>
                            <div className={styles.featuredTag}>🔥 Free Access</div>
                            <div className={styles.cardIcon}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                            </div>
                            <div className={styles.cardBadge}>Education</div>
                            <h3 className={styles.cardTitle}>Free Training Class</h3>
                            <p className={styles.cardDescription}>
                                Learn the secrets of successful e-commerce from industry experts. 
                                Get hands-on training on live streaming and content creation.
                            </p>
                            <ul className={styles.cardFeatures}>
                                {[
                                    'Expert-Led Training Sessions',
                                    'Live Streaming Masterclass',
                                    'Content Creation Workshop',
                                    'Affiliate Marketing Guide'
                                ].map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <div className={styles.featureCheck}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <motion.a
                                href="https://forms.gle/VJEBctBVDSpNVzNB6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.btnSecondary}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Join Free Class
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </motion.a>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </div>
        </section>
    );
}
