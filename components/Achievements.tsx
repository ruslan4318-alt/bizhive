'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from './animations';
import Link from 'next/link';
import styles from './Achievements.module.css';

const successStories = [
    { 
        brand: 'Beauty Brand A',
        metric: 'Monthly Revenue',
        before: 'Rp 150M',
        after: 'Rp 2.1B',
        growth: '+1,300%',
        period: '6 months'
    },
    { 
        brand: 'Fashion Brand B',
        metric: 'Live Stream Sales',
        before: 'Rp 5M/stream',
        after: 'Rp 120M/stream',
        growth: '+2,300%',
        period: '4 months'
    },
    { 
        brand: 'F&B Brand C',
        metric: 'Order Volume',
        before: '500 orders/day',
        after: '8,500 orders/day',
        growth: '+1,600%',
        period: '8 months'
    }
];

export default function Achievements() {
    return (
        <section className={styles.section} id="achievements">
            <div className={styles.container}>
                <AnimatedSection className={styles.header}>
                    <p className={styles.badge}>Success Stories</p>
                    <h2 className={styles.title}>
                        Before & <span className={styles.titleHighlight}>After Results</span>
                    </h2>
                    <div className={styles.divider}></div>
                    <p className={styles.subtitle}>
                        Real transformations from brands we&apos;ve partnered with, showcasing the power of data-driven growth.
                    </p>
                </AnimatedSection>
                
                <div className={styles.grid}>
                    {successStories.map((item, i) => (
                        <motion.div 
                            key={i}
                            className={styles.card}
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.brand}>{item.brand}</span>
                                <span className={styles.growthBadge}>{item.growth}</span>
                            </div>
                            
                            <p className={styles.metricLabel}>{item.metric}</p>
                            
                            <div className={styles.results}>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultLabel}>Before</p>
                                    <p className={styles.resultValue}>{item.before}</p>
                                </div>
                                <div className={styles.arrow}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                                <div className={styles.resultItem}>
                                    <p className={styles.resultLabel}>After</p>
                                    <p className={styles.resultValueAfter}>{item.after}</p>
                                </div>
                            </div>
                            
                            <div className={styles.cardFooter}>
                                <p className={styles.timeline}>Timeline: <span>{item.period}</span></p>
                                <div className={styles.status}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <AnimatedSection className={styles.footerActions} delay={0.3}>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Link href="/clients" className={styles.btnViewAll}>
                            View Full Success Studies
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </AnimatedSection>
            </div>
        </section>
    );
}
