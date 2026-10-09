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

        {/* 2. Strategic Partners & Clients (Soft Tint Bar) */}
        <section className="section-padding bg-slate-100/70 border-y border-slate-200/80">
          <Clients />
        </section>

        {/* 3. Services Section (Clean White with Elevated Cards) */}
        <section className="section-padding bg-white">
          <Services />
        </section>

        {/* 4. Achievements Section (Soft Cool-Blue/Gray Tint for Before/After) */}
        <section className="section-padding bg-[#f4f7fb] border-y border-slate-200/70 relative">
          <Achievements />
        </section>

        {/* 5. Performance Showcase Component (Dark Contrast Anchor) */}
        <section className="section-padding bg-[#0b1f3b] text-white">
          <Performance />
        </section>

        {/* 6. News Preview (Clean White Background) */}
        <section className="section-padding bg-white">
          <NewsPreview />
        </section>

        {/* 7. Partnership & Training Component (Soft Tinted Warm Banner Area) */}
        <section className="section-padding bg-gradient-to-b from-slate-50 via-amber-50/20 to-slate-100/80 border-t border-slate-200/70">
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
