'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase, type NewsArticle } from '@/lib/supabase';
import styles from './NewsPreview.module.css';

export default function NewsPreview() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .eq('is_published', true)
                    .order('published_at', { ascending: false })
                    .limit(3);

                if (!error && data) {
                    setArticles(data as NewsArticle[]);
                }
            } catch (err) {
                console.error('Error fetching preview news:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
            }
        }
    };

    if (!loading && articles.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div 
                    className={styles.header}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>News & Updates</h2>
                    <Link href="/news" className={styles.viewAll}>
                        View All News →
                    </Link>
                </motion.div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : (
                    <motion.div 
                        className={styles.grid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {articles.map((article) => (
                            <motion.div key={article.id} variants={itemVariants}>
                                <Link
                                    href={`/news/${article.slug}`}
                                    className={styles.card}
                                >
                                    <div className={styles.cardImage}>
                                        {article.featured_image ? (
                                            <img src={article.featured_image} alt={article.title} />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <span>News</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.cardContent}>
                                        <span className={styles.date}>
                                            {new Date(article.published_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        <h3 className={styles.cardTitle}>{article.title}</h3>
                                        <p className={styles.cardExcerpt}>{article.excerpt}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
