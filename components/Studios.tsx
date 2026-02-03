import styles from './Studios.module.css';

export default function Studios() {
    return (
        <section id="studios" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Studios</h2>
                    <p className={styles.subtitle}>
                        Professional live commerce studios designed to support scalable Shopee and
                        TikTok Shop campaigns with high-performance execution.
                    </p>
                </div>
                <div className={styles.grid}>
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className={styles.studioCard}>
                            <div className={styles.imagePlaceholder}>
                                <span className={styles.placeholderText}>Studio {num}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Live Commerce Studio {num}</h3>
                                <p>Professional streaming setup with high-quality lighting and equipment</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🎬</span>
                        <span>Professional Lighting</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>📹</span>
                        <span>4K Streaming</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🎤</span>
                        <span>Studio Audio</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🖥️</span>
                        <span>Multi-Camera Setup</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
