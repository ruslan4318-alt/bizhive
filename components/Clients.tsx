import styles from './Clients.module.css';

// Placeholder client logos - these would be replaced with actual client logos
const clients = [
    'Beauty Brand 1',
    'Lifestyle Brand 2',
    'Consumer Goods 3',
    'Fashion Brand 4',
    'Health Brand 5',
    'Tech Brand 6',
    'Food Brand 7',
    'Home Brand 8',
];

export default function Clients() {
    return (
        <section id="clients" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Clients</h2>
                    <p className={styles.subtitle}>
                        Trusted by national and international brands across beauty, lifestyle,
                        and consumer goods categories.
                    </p>
                </div>
                <div className={styles.logoGrid}>
                    {clients.map((client, index) => (
                        <div key={index} className={styles.logoCard}>
                            <span className={styles.logoPlaceholder}>{client}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
