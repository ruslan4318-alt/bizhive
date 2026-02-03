import styles from './Metrics.module.css';

const metrics = [
    { number: '12+', label: 'Live Commerce Studios' },
    { number: '5,000+', label: 'Managed Influencers (KOL)' },
    { number: '1.4M+', label: 'Cumulative Marketing Execution' },
    { number: '14.8M+', label: 'Cumulative Revenue' },
    { number: '3rd', label: 'Year of Operation' },
    { number: '1,000+', label: 'Creator Portfolio' },
    { number: '50+', label: 'Brand Managers' },
    { number: '2,000+', label: 'Video Productions' },
];

export default function Metrics() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Agency Profile</h2>
                    <p className={styles.subtitle}>
                        Key metrics that demonstrate our experience and capability in e-commerce marketing.
                    </p>
                </div>
                <div className={styles.grid}>
                    {metrics.map((metric, index) => (
                        <div key={index} className={styles.metricCard}>
                            <span className={styles.number}>{metric.number}</span>
                            <span className={styles.label}>{metric.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
