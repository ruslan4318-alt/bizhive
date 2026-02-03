import styles from './JoinProgram.module.css';

export default function JoinProgram() {
    return (
        <section className={styles.section} id="join">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>🚀 Get Started</span>
                    <h2 className={styles.title}>
                        Ready to <span className={styles.highlight}>Grow Together?</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Choose the path that fits your journey. Whether you want to collaborate or learn, 
                        we&apos;re here to help you succeed in e-commerce.
                    </p>
                </div>

                <div className={styles.cards}>
                    {/* Collabs Card */}
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className={styles.cardBadge}>Partnership</div>
                        <h3 className={styles.cardTitle}>Collabs with Us</h3>
                        <p className={styles.cardDescription}>
                            Join our network of brands, influencers, and content creators. 
                            Let&apos;s create impactful campaigns together and scale your 
                            e-commerce presence on TikTok Shop &amp; Shopee.
                        </p>
                        <ul className={styles.cardFeatures}>
                            <li>🤝 Brand Partnership Opportunities</li>
                            <li>📈 Access to Our MCN Network</li>
                            <li>🎯 Strategic Marketing Support</li>
                            <li>💡 Creative Campaign Collaboration</li>
                        </ul>
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLSfm9Q549Rgidcn9iVpHhFptf3S4Bj-7JGMm0W5meWv7DDnrdA/viewform?usp=dialog"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnPrimary}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
                            </svg>
                            Start Collaboration
                        </a>
                    </div>

                    {/* Free Training Card */}
                    <div className={`${styles.card} ${styles.cardFeatured}`}>
                        <div className={styles.featuredTag}>🔥 Free Access</div>
                        <div className={styles.cardIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                        <div className={styles.cardBadge}>Education</div>
                        <h3 className={styles.cardTitle}>Join Our Free Training Class</h3>
                        <p className={styles.cardDescription}>
                            Learn the secrets of successful e-commerce from industry experts. 
                            Get hands-on training on live streaming, content creation, 
                            and affiliate marketing strategies.
                        </p>
                        <ul className={styles.cardFeatures}>
                            <li>🎓 Expert-Led Training Sessions</li>
                            <li>📱 Live Streaming Masterclass</li>
                            <li>🎬 Content Creation Workshop</li>
                            <li>💰 Affiliate Marketing Guide</li>
                        </ul>
                        <a
                            href="https://forms.gle/VJEBctBVDSpNVzNB6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnSecondary}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                            Join Free Class
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
