'use client';

import { 
  AnimatedSection 
} from '@/components/animations';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Achievements from '@/components/Achievements';
import Performance from '@/components/Performance';
import Clients from '@/components/Clients';
import NewsPreview from '@/components/NewsPreview';
import JoinProgram from '@/components/JoinProgram';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <>
      <div className="relative w-full overflow-x-hidden flex flex-col">
        {/* 1. Hero Section (Includes Platform Partners) */}
        <Hero />

        {/* 2. Strategic Partners & Clients (Moved up) */}
        <section className="section-padding bg-slate-50">
          <Clients />
        </section>

        {/* 3. Services Section */}
        <section className="section-padding bg-white">
          <Services />
        </section>

        {/* 4. Achievements Section (Success Stories) */}
        <section className="section-padding bg-slate-50">
          <Achievements />
        </section>

        {/* 5. Performance Showcase Component (Dark Contrast) */}
        <section className="section-padding bg-slate-900 text-white">
          <Performance />
        </section>

        {/* 6. News Preview (Live from Supabase) */}
        <section className="section-padding bg-white">
          <NewsPreview />
        </section>

        {/* 7. Partnership & Training Component */}
        <section className="section-padding bg-slate-50">
          <JoinProgram />
        </section>

        {/* 8. Final CTA Component */}
        <section className="section-padding bg-white">
          <FinalCTA />
        </section>
      </div>
    </>
  );
}
