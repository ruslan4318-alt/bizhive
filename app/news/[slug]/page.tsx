'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase, type NewsArticle } from '@/lib/supabase';
import styles from './article.module.css';

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArticle() {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (!error && data) {
                    setArticle(data as NewsArticle);
                }
            } catch (err) {
                console.error('Error fetching article:', err);
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (!article) {
        notFound();
    }

    // Function to format plain text into paragraphs
    const formatContent = (text: string | null) => {
        if (!text) return '';
        
        // If content already has HTML tags, return it
        if (/<[a-z][\s\S]*>/i.test(text)) {
            return text;
        }

        // Otherwise, split by newlines and wrap in paragraphs
        return text
            .split(/\n\s*\n/)
            .map(para => para.trim())
            .filter(para => para.length > 0)
            .map(para => `<p>${para.replace(/\n/g, '<br />')}</p>`)
            .join('');
    };

    return (
        <article className={styles.article}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/news" className={styles.backLink}>
                            ← Back to News
                        </Link>
                    </motion.div>
                    
                    <motion.span 
                        className={styles.date}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {new Date(article.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </motion.span>
                    
                    <motion.h1 
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {article.title}
                    </motion.h1>
                    
                    {article.excerpt && (
                        <motion.p 
                            className={styles.excerpt}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {article.excerpt}
                        </motion.p>
                    )}
                </header>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className={styles.featuredImage}>
                        {article.featured_image ? (
                            <img src={article.featured_image} alt={article.title} />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <span>BIZHIVE NEWS</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
                />

                <motion.footer 
                    className={styles.footer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Link href="/news" className={styles.backButton}>
                        ← Back to All News
                    </Link>
                </motion.footer>
            </div>
        </article>
    );
}
