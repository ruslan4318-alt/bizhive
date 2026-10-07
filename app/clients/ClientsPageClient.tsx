'use client';

import { motion, Variants } from 'framer-motion';
import styles from './clients.module.css';

export interface ClientItem {
  id: string;
  name: string;
  logo_url?: string | null;
  industry?: string | null;
  platform?: string | null;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  before_value?: string | null;
  after_value?: string | null;
  growth_percentage?: string | null;
  metric_type?: string | null;
  timeline?: string | null;
  featured_image?: string | null;
  is_featured?: boolean;
  client?: {
    name: string;
    logo_url?: string | null;
    industry?: string | null;
  } | null;
}

interface ClientsPageClientProps {
  brands: ClientItem[];
  caseStudies: CaseStudyItem[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 50 }
  }
};

export default function ClientsPageClient({ brands, caseStudies }: ClientsPageClientProps) {
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

      {/* Section 1: Client Logos Grid — Dynamic dari Supabase */}
      <section className="py-20 bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {brands.length === 0 ? (
            <p className="text-center text-slate-400">Belum ada klien yang ditampilkan.</p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center"
            >
              {brands.map((brand) => (
                <motion.div
                  key={brand.id}
                  variants={itemVariants}
                  className="group relative flex items-center justify-center p-6 aspect-square rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Gradient Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                  {/* Logo */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                        <span className="text-2xl font-extrabold text-slate-300 group-hover:text-amber-500 transition-colors">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-600 text-center leading-tight px-1 transition-colors">
                          {brand.name}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Section 2: Detailed Case Studies — Dynamic dari Supabase */}
      <section className={styles.clientsSection}>
        <div className={styles.container}>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">Challenges &amp; Proven Results</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Real transformation stories. We turn obstacles into opportunities.
              </p>
            </motion.div>
          </div>

          {caseStudies.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto">
              <span className="text-4xl mb-3 block">📈</span>
              <p className="text-white text-lg font-semibold mb-1">Belum Ada Case Study</p>
              <p className="text-slate-400 text-sm">
                Case study yang ditambahkan melalui menu BIZHIVE Admin akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            <div className="grid gap-16 max-w-5xl mx-auto">
              {caseStudies.map((cs, index) => (
                <motion.div
                  key={cs.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative group"
                >
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
                      <div className="flex items-center gap-6">
                        {cs.client?.logo_url ? (
                          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm">
                            <img src={cs.client.logo_url} alt={cs.client.name} className="w-full h-full object-contain" />
                          </div>
                        ) : cs.featured_image ? (
                          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                            <img src={cs.featured_image} alt={cs.title} className="w-full h-full object-cover" />
                          </div>
                        ) : null}
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{cs.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            {cs.client?.name && (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 uppercase tracking-wide">
                                {cs.client.name}
                              </span>
                            )}
                            {cs.client?.industry && (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                                {cs.client.industry}
                              </span>
                            )}
                            {cs.timeline && (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 uppercase tracking-wide">
                                {cs.timeline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description / Story */}
                    {cs.description && (
                      <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {cs.description}
                        </p>
                      </div>
                    )}

                    {/* Metrics Impact Grid */}
                    {(cs.growth_percentage || cs.before_value || cs.after_value) && (
                      <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                          <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            {cs.metric_type || 'Impact Delivered'}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x md:divide-white/10">
                            {cs.before_value && (
                              <div className="text-center md:text-left md:pl-6 first:pl-0">
                                <div className="text-2xl md:text-3xl font-bold text-slate-400 mb-1">{cs.before_value}</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Before</div>
                              </div>
                            )}
                            {cs.after_value && (
                              <div className="text-center md:text-left md:pl-6 first:pl-0">
                                <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{cs.after_value}</div>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">After</div>
                              </div>
                            )}
                            {cs.growth_percentage && (
                              <div className="text-center md:text-left md:pl-6 first:pl-0">
                                <div className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">{cs.growth_percentage}</div>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Growth</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
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
