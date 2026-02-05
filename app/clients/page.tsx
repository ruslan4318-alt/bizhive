'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import styles from './clients.module.css';

// Full list of clients for the Logo Grid
const allClients = [
  { id: 1, name: 'Ballop', logo: '/clients/Ballop.png' },
  { id: 2, name: 'Biosoop', logo: '/clients/Biosoop.png' },
  { id: 3, name: 'Biuti', logo: '/clients/Biuti.png' },
  { id: 4, name: 'ButtonScarves Beauty', logo: '/clients/ButtonScarv Beauty.png' },
  { id: 5, name: 'Cosmax', logo: '/clients/Cosmax.png' },
  { id: 6, name: 'Family Dr', logo: '/clients/Family.Dr.png' },
  { id: 7, name: 'Glint', logo: '/clients/Glint.png' },
  { id: 8, name: 'Gluco', logo: '/clients/Gluco.png' },
  { id: 9, name: 'Headspa7', logo: '/clients/Headspa7.png' },
  { id: 10, name: 'Hyponic', logo: '/clients/Hyponic.png' },
  { id: 11, name: 'Joco', logo: '/clients/Joco.png' },
  { id: 12, name: 'Kuoca', logo: '/clients/Kuoca.png' },
  { id: 13, name: 'Mamjip', logo: '/clients/Mamjip.png' },
  { id: 14, name: 'Miseum', logo: '/clients/Miseum.png' },
  { id: 15, name: 'Neomed', logo: '/clients/Neomed.png' },
  { id: 16, name: 'Seoul Studio', logo: '/clients/Seoul Studio.png' },
  { id: 17, name: 'Sisterann', logo: '/clients/Sisterann.png' },
  { id: 18, name: 'Beyond', logo: '/clients/beyond.png' },
  { id: 19, name: 'Black Rouge', logo: '/clients/blakrouge.png' },
  { id: 20, name: 'Daon Dining', logo: '/clients/daondinning.png' },
  { id: 21, name: 'Kahi', logo: '/clients/kahi.png' },
  { id: 22, name: 'Some By Mi', logo: '/clients/somebymii.png' },
  { id: 23, name: 'Sura', logo: '/clients/sura.png' },
  { id: 24, name: 'The Face Shop', logo: '/clients/thefaceshop.png' },
  { id: 25, name: 'Yoajung', logo: '/clients/yoajung.png' },
];

// Selected clients for Detailed Success Stories (5 Brands Requested)
const successStories = [
    {
        id: 'story-1',
        name: 'Seoul Studio',
        category: 'Service',
        platform: 'Shopee',
        logo: '/clients/Seoul Studio.png',
        challenge: 'Large product catalog was disorganized, leading to poor customer experience and low conversion.',
        solution: 'Full catalog restructuring, categorization, and bundling strategy for better discoverability.',
        colors: { bg: 'from-stone-50 to-warm-gray-50', accent: 'text-stone-600', border: 'border-stone-100' },
        results: [
            { label: 'Sales Increase', value: '+90%' },
            { label: 'Visitor Growth', value: '+35%' },
            { label: 'Order Volume', value: '+25%' },
        ],
    },
    {
        id: 'story-2',
        name: 'Some By Mi',
        category: 'Skincare',
        platform: 'TikTok Shop',
        logo: '/clients/somebymii.png',
        challenge: 'Needed to build brand awareness and sales through influencer partnerships but struggled with management.',
        solution: 'End-to-end KOL recruitment, vetting, and performance-driven content campaign execution.',
        colors: { bg: 'from-emerald-50 to-teal-50', accent: 'text-emerald-600', border: 'border-emerald-100' },
        results: [
            { label: 'Sales Increase', value: '+150%' },
            { label: 'Visitor Growth', value: '+300%' },
            { label: 'Order Volume', value: '+180%' },
        ],
    },
    {
        id: 'story-3',
        name: 'Hyponic',
        category: 'Pet Care',
        platform: 'Shopee',
        logo: '/clients/Hyponic.png',
        challenge: 'Premium pricing made it difficult to compete with mass-market brands on Shopee.',
        solution: 'Premium brand storytelling, trusted reviews program, and targeted ads for high-value pet owners.',
        colors: { bg: 'from-blue-50 to-cyan-50', accent: 'text-blue-600', border: 'border-blue-100' },
        results: [
            { label: 'Sales Increase', value: '+85%' },
            { label: 'Visitor Growth', value: '+200%' },
            { label: 'Order Volume', value: '+60%' },
        ],
    },
    {
        id: 'story-4',
        name: 'Joco Production',
        category: 'Service',
        platform: 'TikTok Shop',
        logo: '/clients/Joco.png',
        challenge: 'Wanted to leverage live streaming for clients but lacked technical expertise and setup.',
        solution: 'Professional studio setup, technical host training, and product demo script development.',
        colors: { bg: 'from-indigo-50 to-violet-50', accent: 'text-indigo-600', border: 'border-indigo-100' },
        results: [
            { label: 'Sales Increase', value: '+120%' },
            { label: 'Visitor Growth', value: '+450%' },
            { label: 'Order Volume', value: '+300%' },
        ],
    },
    {
        id: 'story-5',
        name: 'Cosmax',
        category: 'Manufacturing',
        platform: 'Shopee',
        logo: '/clients/Cosmax.png',
        challenge: 'B2B giant entering B2C market; needed a complete digital transformation strategy.',
        solution: 'Direct-to-consumer channel build, official store launch, and brand awareness campaigns.',
        colors: { bg: 'from-pink-50 to-rose-50', accent: 'text-rose-600', border: 'border-rose-100' },
        results: [
            { label: 'Sales Increase', value: '+200%' },
            { label: 'Visitor Growth', value: '+500%' },
            { label: 'Order Volume', value: '+150%' },
        ],
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            type: "spring" as const, 
            stiffness: 50 
        } 
    }
};

export default function ClientsPage() {
    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className={styles.badge}>Our Partners</span>
                        <h1 className={styles.title}>
                            Client <span className={styles.highlight}>Success Stories</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Helping brands across industries unlock their full e-commerce potential with data-driven strategies.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section 1: Client Logos Grid */}
            <section className="py-20 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center"
                    >
                        {allClients.map((client) => (
                            <motion.div 
                                key={client.id}
                                variants={itemVariants} 
                                className="group relative flex items-center justify-center p-6 aspect-square rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Gradient Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                                
                                {/* Logo Image */}
                                <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                                    <img 
                                      src={client.logo} 
                                      alt={client.name}
                                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Detailed Case Studies (Problem, Solution, Results) */}
            <section className={styles.clientsSection}>
                <div className={styles.container}>
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">Challenges & Proven Results</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                                Real transformation stories. We turn obstacles into opportunities.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid gap-16 max-w-5xl mx-auto">
                        {successStories.map((client, index) => (
                            <motion.div 
                                key={client.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative group"
                            >
                                {/* Background Decorative Gradient */}
                                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${client.colors.bg} rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>

                                <div className="relative z-10">
                                    {/* Header: Brand & Tags */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-3 shadow-sm">
                                                <img 
                                                  src={client.logo}
                                                  alt={client.name}
                                                  className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold text-slate-900 mb-2">{client.name}</h3>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">{client.category}</span>
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
                                                        client.platform === 'Shopee' ? 'bg-orange-100 text-orange-600' : 'bg-slate-900 text-white'
                                                    }`}>{client.platform}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Problem vs Solution Split */}
                                    <div className="grid md:grid-cols-2 gap-12 relative mb-12">
                                        {/* Mobile Connector */}
                                        <div className="md:hidden flex justify-center py-4 text-slate-300">
                                            <svg className="w-8 h-8 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>

                                        {/* Desktop Connector Arrow */}
                                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border border-slate-100 items-center justify-center z-10 shadow-sm text-slate-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>

                                        {/* Challenge */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </div>
                                                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">The Challenge</h4>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full">
                                                <p className="text-slate-600 leading-relaxed font-medium">
                                                    &ldquo;{client.challenge}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Solution */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2 justify-end md:flex-row-reverse">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Our Solution</h4>
                                            </div>
                                            <div className={`rounded-2xl p-6 border h-full bg-gradient-to-br ${client.colors.bg} ${client.colors.border}`}>
                                                <p className="text-slate-700 leading-relaxed font-medium">
                                                    {client.solution}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Results Grid - High Impact */}
                                    <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden">
                                        {/* Shine Effect */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                        
                                        <div className="relative z-10">
                                            <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                                Impact Delivered
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-white/10">
                                                {client.results.map((res, idx) => (
                                                    <div key={idx} className="text-center md:text-left md:pl-8 first:pl-0">
                                                        <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{res.value}</div>
                                                        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{res.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="text-center mt-32">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-block"
                        >
                            <p className="mb-8 text-slate-400 text-lg">Ready to write your success story?</p>
                            <a
                                href="https://wa.me/6281290002591?text=Hello%20Mr.%20Lee%2C%20I'm%20interested%20in%20consulting%20with%20BIZHIVE."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                Start Your Consultation
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
