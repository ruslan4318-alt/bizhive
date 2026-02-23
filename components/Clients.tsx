'use client';

import { motion } from 'framer-motion';
import { InfiniteCarousel, AnimatedSection } from './animations';
import styles from './Clients.module.css';

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

export default function Clients() {
    return (
        <section id="clients" className={styles.section}>
            <div className={styles.container}>
                <AnimatedSection className={styles.header}>
                    <h2 className={styles.title}>Our Strategic Partners & Clients</h2>
                    <p className={styles.subtitle}>
                        Trusted by national and international brands across beauty, lifestyle,
                        and consumer goods categories.
                    </p>
                </AnimatedSection>
                
                <div className="relative overflow-hidden py-10 mt-8">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
                    
                    <InfiniteCarousel speed={25}>
                        {clients.map((client) => (
                            <motion.div 
                                key={client.id} 
                                className="flex-shrink-0 w-40 h-40 lg:w-48 lg:h-48 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 transition-all cursor-pointer p-8 mx-4 shadow-sm hover:shadow-md"
                                whileHover={{ scale: 1.05, y: -5 }}
                                title={client.name}
                            >
                                <img 
                                    src={client.logo} 
                                    alt={client.name}
                                    className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </motion.div>
                        ))}
                    </InfiniteCarousel>
                </div>
            </div>
        </section>
    );
}
