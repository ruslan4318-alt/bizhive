import styles from './WhyBizhive.module.css';

const platforms = [
    { name: 'Shopee', color: '#EE4D2D' },
    { name: 'TikTok Shop', color: '#000000' },
    { name: 'Lazada', color: '#0F1689' },
    { name: 'Blibli', color: '#0095DA' },
];

export default function WhyBizhive() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2 className={styles.title}>Why BIZHIVE</h2>
                    <p className={styles.description}>
                        BIZHIVE is an official MCN Agency for TikTok & Shopee, providing tailored
                        end-to-end solutions exclusively for e-commerce platforms. We focus on
                        performance-based execution by integrating ads optimization, content production,
                        live streaming, and fulfillment support.
                    </p>
                    <div className={styles.platforms}>
                        <span className={styles.platformLabel}>Supported Platforms:</span>
                        <div className={styles.platformList}>
                            {platforms.map((platform) => (
                                <span key={platform.name} className={styles.platform}>
                                    {platform.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.visual}>
                    <div className={styles.badge}>
                        <span className={styles.badgeIcon}>✓</span>
                        <span className={styles.badgeText}>Official MCN Agency</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
