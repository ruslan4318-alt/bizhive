import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem, AnimatedSection } from './animations';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                {/* Mesh Gradient blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                <div className={styles.overlay}></div>
            </div>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.content}>
                        <AnimatedSection margin="0px">
                            <h1 className={styles.headline}>
                                Marketing Agency<br />
                                for<br />
                                <span className={styles.highlight}>
                                    E-Commerce<br />
                                    Growth
                                    <svg className={styles.underline} viewBox="0 0 400 20" preserveAspectRatio="none">
                                        <motion.path
                                            d="M 0 10 Q 100 0 200 10 Q 300 20 400 10"
                                            fill="none"
                                            stroke="var(--color-amber-500)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1, delay: 0.8 }}
                                        />
                                    </svg>
                                </span>
                            </h1>
                        </AnimatedSection>
                        
                        <AnimatedSection delay={0.1} margin="0px">
                            <p className={styles.subheadline}>
                                We help Shopee and TikTok Shop sellers scale their business through
                                data-driven marketing, content production, and live commerce execution.
                            </p>
                        </AnimatedSection>
                        
                        <AnimatedSection delay={0.2} margin="0px">
                            <div className={styles.cta}>
                                <motion.a
                                    href="https://wa.me/6281250493122"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.btnPrimary}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Contact via WhatsApp
                                </motion.a>
                                <motion.a
                                    href="mailto:jacob@bizhiveid.com"
                                    className={styles.btnSecondary}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    Send Email
                                </motion.a>
                            </div>
                        </AnimatedSection>


                    </div>

                    <div className={styles.imageColumn}>
                        <motion.div 
                            className={styles.imageWrapper}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            <img 
                                src="/images/headings.png" 
                                alt="Bizhive Marketing Excellence" 
                                className={styles.mainImage} 
                            />
                            
                            {/* Floating Badges */}
                            <motion.div 
                                className={styles.badgeRating}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className={styles.badgeIcon}>🚀</div>
                                <div>
                                    <p className={styles.badgeText}>+150%</p>
                                    <p className={styles.badgeSubtext}>SALES GROWTH</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                className={styles.badgeMetrics}
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className={styles.badgeIconGreen}>🎯</div>
                                <div>
                                    <p className={styles.badgeText}>10x</p>
                                    <p className={styles.badgeSubtext}>AVERAGE ROAS</p>
                                </div>
                            </motion.div>

                            {/* Decorative SVG Arrow */}
                            <svg className={styles.decorationArrow} width="60" height="60" viewBox="0 0 60 60" fill="none">
                                <path d="M10 10 Q 30 5 50 30 M 50 30 L 40 30 M 50 30 L 50 20" stroke="var(--color-amber-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                    </div>
                </div>

                {/* Platform Partners - Floating Glass Bar (Positioned at bottom of Hero) */}
                <div className="mt-12 md:mt-24 max-w-5xl mx-auto">
                    <motion.div 
                        className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-3xl p-5 md:p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                    >
                        <div className="text-center mb-5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                Official Platform Partner
                            </span>
                        </div>
                        
                        <StaggerContainer className="flex flex-wrap justify-center items-center gap-6 md:gap-0">
                            {[
                                { 
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ), 
                                    label: 'Official MCN', 
                                    sub: 'Credential', 
                                    color: 'group-hover:text-amber-500', 
                                    bg: 'group-hover:bg-amber-50' 
                                },
                                { 
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                                        </svg>
                                    ), 
                                    label: 'TikTok Partner', 
                                    sub: 'Shop & Ads', 
                                    color: 'group-hover:text-[#ff0050]', 
                                    bg: 'group-hover:bg-black/5' 
                                },
                                { 
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    ), 
                                    label: 'Shopee Preferred', 
                                    sub: 'Seller Center', 
                                    color: 'group-hover:text-[#f15822]', 
                                    bg: 'group-hover:bg-[#f15822]/5' 
                                },
                            ].map((partner, i) => (
                                <StaggerItem key={i} className={`flex-1 min-w-[160px] ${i !== 0 ? 'md:border-l md:border-slate-200/50' : ''}`}>
                                    <motion.div 
                                        className={`flex flex-col items-center gap-2 px-6 py-4 group transition-all duration-300 rounded-2xl ${partner.bg}`}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                    >
                                        <div className={`transition-colors duration-300 ${partner.color} opacity-60 group-hover:opacity-100`}>
                                            {partner.icon}
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-[11px] font-bold text-slate-800 transition-colors duration-300 ${partner.color}`}>
                                                {partner.label}
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-medium">
                                                {partner.sub}
                                            </p>
                                        </div>
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
