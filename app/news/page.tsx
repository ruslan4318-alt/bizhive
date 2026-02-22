'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase, type NewsArticle } from '@/lib/supabase';
import styles from './news.module.css';

export default function NewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .eq('is_published', true)
                    .order('published_at', { ascending: false });

                if (!error && data) {
                    setArticles(data as NewsArticle[]);
                }
            } catch (err) {
                console.error('Error fetching news:', err);
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

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <motion.h1 
                        className={styles.title}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        News & Updates
                    </motion.h1>
                    <motion.p 
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Stay updated with the latest announcements, campaigns, and achievements from BIZHIVE.
                    </motion.p>
                </header>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : articles.length > 0 ? (
                    <motion.div 
                        className={styles.grid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
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
                                        <h2 className={styles.cardTitle}>{article.title}</h2>
                                        <p className={styles.cardExcerpt}>{article.excerpt}</p>
                                        <span className={styles.readMore}>Read More →</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        className={styles.empty}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h3>No news found</h3>
                        <p>We haven't posted any updates yet. Check back soon!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
