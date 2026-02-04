'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Performance.module.css';

interface CounterProps {
    end: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    isVisible: boolean;
}

function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000, isVisible }: CounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isVisible]);

    return <span>{prefix}{count.toLocaleString('id-ID')}{suffix}</span>;
}

// Chart that matches the screenshot pattern - with spike around day 9-11
function RealisticChart({ type, color, isVisible }: { type: 'before' | 'after'; color: string; isVisible: boolean }) {
    // Data matching screenshot: relatively flat with spike around day 9-11
    const beforeData = [45, 48, 44, 50, 47, 52, 48, 95, 88, 75, 52, 50, 48, 52, 55, 50, 48, 52, 55, 58, 52, 55, 58, 72, 78, 68, 55, 52, 50, 52];
    const afterData = [55, 58, 52, 60, 58, 65, 60, 98, 92, 82, 65, 62, 58, 62, 68, 62, 60, 65, 68, 72, 65, 68, 72, 85, 92, 80, 68, 65, 62, 65];
    
    const data = type === 'before' ? beforeData : afterData;
    const maxValue = Math.max(...data);
    
    // Create SVG path
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 280;
        const y = 70 - (value / maxValue) * 55;
        return { x, y };
    });

    // Create smooth curve path
    const pathData = points.reduce((acc, point, index) => {
        if (index === 0) return `M ${point.x},${point.y}`;
        const prev = points[index - 1];
        const cpx = (prev.x + point.x) / 2;
        return `${acc} C ${cpx},${prev.y} ${cpx},${point.y} ${point.x},${point.y}`;
    }, '');

    // Area path (for gradient fill)
    const areaPath = `${pathData} L 280,70 L 0,70 Z`;

    return (
        <svg 
            className={`${styles.realisticChart} ${isVisible ? styles.chartVisible : ''}`} 
            viewBox="0 0 280 80" 
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={`areaGradient-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            
            {/* Grid lines */}
            <g className={styles.gridLines}>
                <line x1="0" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.05)" />
                <line x1="0" y1="40" x2="280" y2="40" stroke="rgba(255,255,255,0.05)" />
                <line x1="0" y1="60" x2="280" y2="60" stroke="rgba(255,255,255,0.05)" />
            </g>
            
            {/* Area fill */}
            <path 
                d={areaPath} 
                fill={`url(#areaGradient-${type})`}
                className={styles.areaFill}
            />
            
            {/* Line */}
            <path 
                d={pathData} 
                fill="none" 
                stroke={color} 
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.chartLine}
            />

            {/* Peak indicator for the spike */}
            <circle 
                cx={points[7].x} 
                cy={points[7].y} 
                r="4" 
                fill={color}
                className={styles.peakDot}
            />
        </svg>
    );
}

export default function Performance() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <>
            <section ref={sectionRef} className={styles.section} id="performance">
                <div className={styles.container}>
                    <div className={`${styles.header} ${isVisible ? styles.fadeIn : ''}`}>
                        <span className={styles.badge}>📈 Proven Results</span>
                        <h2 className={styles.title}>
                            Real Impact, <span className={styles.highlight}>Real Growth</span>
                        </h2>
                        <p className={styles.subtitle}>
                            See how we transformed Brand A&apos;s Shopee performance in just 1 month
                        </p>
                    </div>

                    <div className={styles.showcase}>
                        {/* Before Card */}
                        <div className={`${styles.card} ${styles.cardBefore} ${isVisible ? styles.slideInLeft : ''}`}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardLabel}>Before</span>
                                <span className={styles.cardPeriod}>September 2024</span>
                            </div>
                            
                            <div className={styles.metricsGrid}>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Sales</span>
                                    <span className={styles.metricValue}>
                                        Rp <AnimatedCounter end={7633} suffix="M" isVisible={isVisible} />
                                    </span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Visitors</span>
                                    <span className={styles.metricValue}>
                                        <AnimatedCounter end={977958} isVisible={isVisible} />
                                    </span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Orders</span>
                                    <span className={styles.metricValue}>
                                        <AnimatedCounter end={37569} isVisible={isVisible} />
                                    </span>
                                </div>
                            </div>

                            <div className={styles.chartContainer}>
                                <div className={styles.chartLabel}>Trend Chart</div>
                                <RealisticChart type="before" color="#6B7280" isVisible={isVisible} />
                                <div className={styles.chartAxis}>
                                    <span>1</span>
                                    <span>10</span>
                                    <span>20</span>
                                    <span>30</span>
                                </div>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className={`${styles.arrow} ${isVisible ? styles.arrowVisible : ''}`}>
                            <div className={styles.arrowPulse}></div>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* After Card */}
                        <div className={`${styles.card} ${styles.cardAfter} ${isVisible ? styles.slideInRight : ''}`}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardLabelAfter}>After</span>
                                <span className={styles.cardPeriod}>October 2024</span>
                            </div>
                            
                            <div className={styles.metricsGrid}>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Sales</span>
                                    <span className={`${styles.metricValue} ${styles.metricGrowth}`}>
                                        Rp <AnimatedCounter end={9486} suffix="M" isVisible={isVisible} />
                                    </span>
                                    <span className={styles.growthTag}>+24.2%</span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Visitors</span>
                                    <span className={`${styles.metricValue} ${styles.metricGrowth}`}>
                                        <AnimatedCounter end={1288169} isVisible={isVisible} />
                                    </span>
                                    <span className={styles.growthTag}>+31.7%</span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Orders</span>
                                    <span className={`${styles.metricValue} ${styles.metricGrowth}`}>
                                        <AnimatedCounter end={45932} isVisible={isVisible} />
                                    </span>
                                    <span className={styles.growthTag}>+22.3%</span>
                                </div>
                            </div>

                            <div className={styles.chartContainer}>
                                <div className={styles.chartLabel}>Trend Chart</div>
                                <RealisticChart type="after" color="#10B981" isVisible={isVisible} />
                                <div className={styles.chartAxis}>
                                    <span>1</span>
                                    <span>10</span>
                                    <span>20</span>
                                    <span>30</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Badge & View Report Button */}
                    <div className={`${styles.footer} ${isVisible ? styles.fadeInUp : ''}`}>
                        <div className={styles.categoryBadge}>
                            <span>🛍️ Cosmetic</span>
                            <span className={styles.separator}>•</span>
                            <span>📱 Shopee</span>
                            <span className={styles.separator}>•</span>
                            <span>⏱️ 1 Month</span>
                        </div>
                        <button 
                            className={styles.viewReportBtn}
                            onClick={() => setShowModal(true)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                            View Full Report
                        </button>
                        <Link href="/clients" className={styles.viewAllLink}>
                            View All Case Studies
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modal for Full Report */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                        <div className={styles.modalContent}>
                            <Image
                                src="/performance-proof.png"
                                alt="Performance Report - Shopee Optimization Results"
                                width={1024}
                                height={513}
                                className={styles.modalImage}
                            />
                        </div>
                        <div className={styles.modalCaption}>
                            <span>📊 Official Shopee Seller Dashboard Report</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
