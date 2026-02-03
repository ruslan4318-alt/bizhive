'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  CountUp, 
  InfiniteCarousel,
  HoverCard,
  Floating,
  slideInLeft,
  slideInRight,
  scaleIn
} from '@/components/animations';

// SVG Icons as components for consistency
const Icons = {
  Store: () => (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
  Video: () => (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  Live: () => (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TikTok: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  ),
  Shopee: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  Arrow: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  TrendUp: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

// Client logos data
const clients = [
  { id: 1, name: 'Ballop', logo: '/clients/Ballop.png' },
  { id: 2, name: 'Biosoop', logo: '/clients/Biosoop.png' },
  { id: 3, name: 'Biuti', logo: '/clients/Biuti.png' },
  { id: 4, name: 'ButtonScarv Beauty', logo: '/clients/ButtonScarv Beauty.png' },
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
  { id: 20, name: 'Daon Dinning', logo: '/clients/daondinning.png' },
  { id: 21, name: 'Kahi', logo: '/clients/kahi.png' },
  { id: 22, name: 'Some By Mi', logo: '/clients/somebymii.png' },
  { id: 23, name: 'Sura', logo: '/clients/sura.png' },
  { id: 24, name: 'The Face Shop', logo: '/clients/thefaceshop.png' },
  { id: 25, name: 'Yoajung', logo: '/clients/yoajung.png' },
];

export default function Home() {
  return (
    <>
      <div className="relative w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 px-6 z-10">
          {/* Background - fixed positioning */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Floating distance={20} duration={8}>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/4"></div>
            </Floating>
            <Floating distance={15} duration={10}>
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-amber-50 to-transparent rounded-full blur-3xl opacity-40 -translate-x-1/3 translate-y-1/4"></div>
            </Floating>
          </div>
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            <div className="flex flex-col gap-6">
              <AnimatedSection delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 w-fit">
                  <motion.span 
                    className="w-2 h-2 rounded-full bg-amber-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">Accepting New Partners</span>
                </div>
              </AnimatedSection>
              
              <AnimatedSection variants={slideInLeft} delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
                  Marketing Agency for{' '}
                  <span className="text-amber-500">E-Commerce Growth</span>
                </h1>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2}>
                <p className="text-base lg:text-lg text-slate-500 max-w-lg leading-relaxed">
                  We help brands scale through data-driven strategies, premium content production, and live streaming excellence on Shopee, TikTok Shop, and more.
                </p>
              </AnimatedSection>

              
              <AnimatedSection delay={0.4}>
                <div className="flex items-center gap-4 pt-4 text-slate-400">
                  <p className="text-sm font-medium">Trusted by leading platforms</p>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
              </AnimatedSection>
            </div>
            
            <AnimatedSection variants={slideInRight} delay={0.2}>
              <div className="relative">
                <motion.div 
                  className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-xl bg-white relative"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-200">BIZHIVE</span>
                  </div>
                  <motion.div 
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-5 rounded-xl flex items-center justify-between shadow-lg border border-slate-100"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-1">Cumulative Revenue</p>
                      <p className="text-xl text-slate-900 flex items-center gap-2">
                        <span className="font-light">Rp</span>
                        <span className="font-semibold tracking-tight"><CountUp target={14.8} suffix="M+" duration={2} /></span>
                        <span className="text-emerald-500 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">↑ Growing</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                      <Icons.TrendUp />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Platform Partners */}
        <section className="py-8 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <StaggerContainer className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
              {[
                { Icon: Icons.Check, label: 'Official MCN', color: 'text-emerald-500' },
                { Icon: Icons.TikTok, label: 'TikTok Partner', color: 'text-slate-800' },
                { Icon: Icons.Shopee, label: 'Shopee Preferred', color: 'text-orange-500' },
                { Icon: Icons.Building, label: 'Lazada Certified', color: 'text-blue-600' }
              ].map((partner, i) => (
                <StaggerItem key={i}>
                  <motion.div 
                    className="flex items-center gap-2 text-sm lg:text-base font-semibold text-slate-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={partner.color}><partner.Icon /></span>
                    {partner.label}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-6 bg-white" id="services">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <p className="text-sm font-semibold text-amber-500 mb-3 uppercase tracking-widest">Our Services</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive E-Commerce Solutions</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">End-to-end marketing services designed to accelerate your growth on every major platform.</p>
            </AnimatedSection>
            
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: 'Store Optimization', desc: 'Maximize your store visibility and conversion rates with data-driven optimization strategies.', Icon: Icons.Store, href: '/services/store-optimization' },
                { title: 'Content Production', desc: 'High-quality product photography, videos, and creative content that sells.', Icon: Icons.Video, href: '/services/content-production' },
                { title: 'Live Streaming', desc: 'Professional live commerce execution with trained hosts and optimized setups.', Icon: Icons.Live, href: '/services/live-streaming' },
                { title: 'Affiliate & KOL', desc: 'Connect with 5,000+ managed KOLs and affiliates for maximum reach.', Icon: Icons.Users, href: '/services/affiliate-kol' }
              ].map((service, i) => (
                <StaggerItem key={i}>
                  <HoverCard className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 h-full">
                    <Link href={service.href} className="block h-full">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 mb-5 shadow-sm border border-slate-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <service.Icon />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-500 transition-colors">{service.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
                      <div className="mt-5 text-amber-500 font-medium text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn More <Icons.Arrow />
                      </div>
                    </Link>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Achievement Before/After Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" id="achievements">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <p className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-widest">Success Stories</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Before & After Results</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Real transformations from brands we&apos;ve partnered with</p>
            </AnimatedSection>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-6">
              {[
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
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.brand}</span>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">{item.growth}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{item.metric}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">Before</p>
                        <p className="text-lg text-slate-300 font-light">{item.before}</p>
                      </div>
                      <div className="text-amber-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-xs text-slate-500 mb-1">After</p>
                        <p className="text-lg text-amber-400 font-semibold">{item.after}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-500">Timeline: <span className="text-slate-400">{item.period}</span></p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <AnimatedSection className="text-center mt-10">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link href="/case-studies" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm transition-all">
                  View All Case Studies <Icons.Arrow />
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="py-20 px-6 bg-slate-50" id="performance">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <p className="text-sm font-semibold text-amber-500 mb-3 uppercase tracking-widest">Our Track Record</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Numbers That Speak</h2>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { value: 5, suffix: 'K+', label: 'Managed KOLs' },
                { value: 50, suffix: '+', label: 'Brand Managers' },
                { value: 14.8, suffix: 'M+', label: 'Revenue Generated', prefix: 'Rp ' },
                { value: 1.4, suffix: 'M+', label: 'Marketing Exec', prefix: 'Rp ' },
                { value: 12, suffix: '+', label: 'Studios' },
                { value: 2, suffix: 'K+', label: 'Videos Created' }
              ].map((stat, i) => (
                <StaggerItem key={i}>
                  <HoverCard className="p-5 rounded-2xl bg-white border border-slate-100 text-center shadow-sm">
                    <div className="text-2xl md:text-3xl text-slate-800 mb-1 tracking-tight">
                      <span className="font-light">{stat.prefix || ''}</span>
                      <CountUp target={stat.value} suffix={stat.suffix} duration={2} className="font-semibold" />
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">{stat.label}</div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Clients / Partners - Infinite Scroll */}
        <section className="py-16 px-6 bg-white border-t border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-10">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Our Strategic Partners & Clients</p>
            </AnimatedSection>
            
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              <InfiniteCarousel speed={40}>
                {clients.map((client) => (
                  <motion.div 
                    key={client.id} 
                    className="flex-shrink-0 w-28 h-28 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-all cursor-pointer p-4"
                    whileHover={{ scale: 1.08 }}
                    title={client.name}
                  >
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                ))}
              </InfiniteCarousel>
            </div>
            
            <AnimatedSection className="text-center mt-10">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link href="/clients" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all">
                  View All Clients <Icons.Arrow />
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* News Preview */}
        <section className="py-20 px-6 bg-slate-50" id="news">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-amber-500 mb-2 uppercase tracking-widest">Latest Updates</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">News & Insights</h2>
              </div>
              <motion.div whileHover={{ x: 5 }}>
                <Link href="/news" className="text-amber-500 font-semibold text-sm flex items-center gap-2 hover:text-slate-900 transition-colors">
                  View All News <Icons.Arrow />
                </Link>
              </motion.div>
            </AnimatedSection>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-5">
              {[
                { title: 'BIZHIVE Partners with Major Beauty Brand', date: 'Jan 2026', category: 'Partnership' },
                { title: 'Live Streaming Tips for Maximum Engagement', date: 'Dec 2025', category: 'Tips' },
                { title: 'Q4 2025 E-Commerce Trends Report', date: 'Nov 2025', category: 'Report' }
              ].map((news, i) => (
                <StaggerItem key={i}>
                  <HoverCard className="group bg-white rounded-2xl overflow-hidden border border-slate-100">
                    <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                      <span className="text-slate-300 text-sm font-medium">Featured Image</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-amber-500 uppercase">{news.category}</span>
                        <span className="text-xs text-slate-400">{news.date}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-amber-500 transition-colors leading-snug">{news.title}</h3>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Partnership & Training Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <p className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-widest">Partnership & Growth</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Collabs With Us</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Become part of our growing network. Whether you&apos;re a creator, brand, or agency, there&apos;s a place for you at BIZHIVE.
              </p>
            </AnimatedSection>
            
            {/* Partnership Card - Single Panel */}
            <AnimatedSection className="max-w-2xl mx-auto mb-16">
              <HoverCard className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center hover:bg-white/10 transition-all">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-6">
                  <Icons.Building />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Partner With BIZHIVE</h3>
                <p className="text-slate-400 mb-4 leading-relaxed">
                  Ready to scale your e-commerce business? Partner with us for comprehensive growth solutions including store optimization, content production, live streaming, and KOL management.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {['Store Optimization', 'Content Production', 'Live Streaming', 'Affiliate & KOL'].map((service, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/20">
                      {service}
                    </span>
                  ))}
                </div>
                <motion.a
                  href="https://docs.google.com/forms/d/1HXvuvn6AezccqUoeOOILUwq3Erq_VarntVJZAQdCLuk/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-7 py-3 rounded-xl font-semibold transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Partnership
                  <Icons.Arrow />
                </motion.a>
              </HoverCard>
            </AnimatedSection>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-16">
              <div className="flex-1 h-px bg-white/10"></div>
              <p className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Free Resources</p>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Free Training Class */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <AnimatedSection variants={slideInLeft}>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">
                  Join Our Free <span className="text-amber-400">Training Class</span>
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Learn the secrets of successful e-commerce from our expert team. From live streaming techniques 
                  to store optimization, we share everything in our free training sessions.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Weekly live training on Shopee & TikTok Shop',
                    'Exclusive tips from top-performing sellers',
                    'Q&A session with our experts',
                    'Free e-book and resources',
                    'Access to community of 5000+ sellers'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <span className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdZjLjVnQzjYBRp1yJpeoYFsw-kg4VVJM98rECTGwIZWNgNLg/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-amber-500/20"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register for Free Class
                  <Icons.Arrow />
                </motion.a>
              </AnimatedSection>

              <AnimatedSection variants={slideInRight}>
                <div className="relative">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 text-2xl">
                        📚
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Next Training Session</h4>
                        <p className="text-sm text-slate-400">Every Saturday, 2PM WIB</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { topic: 'Store Optimization Mastery', date: 'Week 1' },
                        { topic: 'Content Production Excellence', date: 'Week 2' },
                        { topic: 'Live Streaming Success', date: 'Week 3' },
                        { topic: 'Affiliate & KOL Strategy', date: 'Week 4' }
                      ].map((session, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 font-bold text-sm">
                            {session.date.split(' ')[1]}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{session.topic}</p>
                            <p className="text-xs text-slate-500">{session.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Participants</p>
                        <p className="text-lg font-bold text-white">5,000+</p>
                      </div>
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-slate-800 flex items-center justify-center text-slate-900 text-xs font-bold">
                            {i}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-slate-800 flex items-center justify-center text-white text-xs font-bold">
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-white">
          <AnimatedSection variants={scaleIn}>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Floating distance={10} duration={6}>
                  <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                </Floating>
                <Floating distance={8} duration={8}>
                  <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                </Floating>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-5 text-white leading-tight">
                  Let&apos;s Build a Scalable{' '}
                  <span className="text-amber-400">E-Commerce Growth System</span>
                </h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  Join hundreds of brands and creators who trust BIZHIVE for their growth.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <motion.a 
                    href="https://wa.me/6281250493122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icons.WhatsApp />
                    Contact via WhatsApp
                  </motion.a>
                  <motion.a 
                    href="mailto:jacob@bizhiveid.com"
                    className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icons.Mail />
                    Send Email
                  </motion.a>
                </div>
                <div className="mt-8 text-slate-500 text-sm">
                  <p>jacob@bizhiveid.com · Yemima@bizhiveid.com · @bizhive_id</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </>
  );
}
