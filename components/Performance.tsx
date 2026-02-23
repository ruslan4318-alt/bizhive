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

// Chart that matches the screenshot pattern
function RealisticChart({ type, color, isVisible }: { type: 'before' | 'after'; color: string; isVisible: boolean }) {
    // Jan 2024: Peaks around 19, 22, 24, 31
    const beforeData = [5, 5, 7, 12, 8, 5, 5, 10, 14, 10, 8, 5, 8, 10, 12, 15, 25, 35, 85, 45, 65, 95, 30, 85, 35, 25, 30, 32, 35, 32, 80];
    // Nov 2024: Massive spike at 11 (11.11)
    const afterData = [35, 38, 42, 45, 43, 48, 45, 43, 46, 55, 120, 35, 55, 62, 58, 55, 65, 60, 62, 58, 55, 58, 62, 70, 60, 65, 75, 70, 68, 65];
    
    const data = type === 'before' ? beforeData : afterData;
    const peakIndex = type === 'before' ? 21 : 10; // Day 22 for Jan, Day 11 for Nov
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

            {/* Peak indicator */}
            <circle 
                cx={points[peakIndex].x} 
                cy={points[peakIndex].y} 
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
                            See how we transformed Shopee performance from January to November
                        </p>
                    </div>

                    <div className={styles.showcase}>
                        {/* Before Card */}
                        <div className={`${styles.card} ${styles.cardBefore} ${isVisible ? styles.slideInLeft : ''}`}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardLabel}>Before</span>
                                <span className={styles.cardPeriod}>January</span>
                            </div>
                            
                            <div className={styles.metricsGrid}>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Sales</span>
                                    <span className={styles.metricValue}>
                                        Rp <AnimatedCounter end={1473} suffix="K" isVisible={isVisible} />
                                    </span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Visitors</span>
                                    <span className={styles.metricValue}>
                                        <AnimatedCounter end={294} isVisible={isVisible} />
                                    </span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Orders</span>
                                    <span className={styles.metricValue}>
                                        <AnimatedCounter end={5} isVisible={isVisible} />
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
                                    <span>31</span>
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
                                <span className={styles.cardPeriod}>November</span>
                            </div>
                            
                            <div className={styles.metricsGrid}>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Sales</span>
                                    <span className={`${styles.metricValue} ${styles.metricGrowth}`}>
                                        Rp <AnimatedCounter end={541253} suffix="K" isVisible={isVisible} />
                                    </span>
                                    <span className={styles.growthTag}>+36,650%</span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Visitors</span>
                                    <span className={`${styles.metricValue} ${styles.metricGrowth}`}>
                                        <AnimatedCounter end={67863} isVisible={isVisible} />
                                    </span>
                                    <span className={styles.growthTag}>+23,000%</span>
                                </div>
                                <div className={styles.metric}>
                                    <span className={styles.metricLabel}>Orders</span>
                                    <span className={`${styles.metricValue} ${styles.metricGrowth}`}>
                                        <AnimatedCounter end={997} isVisible={isVisible} />
                                    </span>
                                    <span className={styles.growthTag}>+19,840%</span>
                                </div>
                            </div>

                            <div className={styles.chartContainer}>
                                <div className={styles.chartLabel}>Trend Chart</div>
                                <RealisticChart type="after" color="#f59e0b" isVisible={isVisible} />
                                <div className={styles.chartAxis}>
                                    <span>1</span>
                                    <span>10</span>
                                    <span>20</span>
                                    <span>30</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View Report Button */}
                    <div className={`${styles.footer} ${isVisible ? styles.fadeInUp : ''}`}>
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
                                src="/performance-proof 1 .png"
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
