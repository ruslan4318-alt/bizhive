import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ServiceDetailClient, { ServiceDetailData } from './ServiceDetailClient';

const defaultServicesData: Record<string, ServiceDetailData> = {
  'shop-optimization': {
    title: 'Shop Optimization',
    tagline: 'Maximize your e-commerce store performance with data-driven strategies',
    category: 'Performance',
    description: 'Our Shop Optimization service helps you unlock the full potential of your e-commerce store. We analyze every aspect of your online presence—from product listings to ad campaigns—and implement proven strategies to boost visibility, conversion rates, and overall sales performance.',
    features: [
      {
        title: 'Website Analysis & Audit',
        description: 'Comprehensive review of your store structure, product listings, and user experience to identify optimization opportunities.',
      },
      {
        title: 'Ads Optimization',
        description: 'Strategic ad placement and targeting to maximize ROAS and reach your ideal customers effectively.',
      },
      {
        title: 'Demographics Setup',
        description: 'Precise audience targeting based on demographics, interests, and shopping behavior patterns.',
      },
      {
        title: 'Voucher & Campaign Marketing',
        description: 'Strategic promotion planning for double days, pay days, and seasonal campaigns to maximize sales.',
      },
    ],
    process: [
      { step: 1, title: 'Audit', description: 'Complete store analysis and competitor research' },
      { step: 2, title: 'Strategy', description: 'Custom optimization plan development' },
      { step: 3, title: 'Implementation', description: 'Execute optimizations across all channels' },
      { step: 4, title: 'Monitor', description: 'Track performance and iterate for growth' },
    ],
    results: [
      { number: '24', label: 'Average Sales Increase', suffix: '%' },
      { number: '31', label: 'Traffic Growth', suffix: '%' },
      { number: '50', label: 'Brands Optimized', suffix: '+' },
    ],
  },
  'content-production': {
    title: 'Content Production',
    tagline: 'Create engaging content that drives sales and builds brand awareness',
    category: 'Creative',
    description: 'Our Content Production service delivers high-quality, platform-optimized content that captures attention and drives conversions. From product videos to lifestyle content, we create assets that tell your brand story and resonate with your target audience.',
    features: [
      {
        title: 'Content Planning & Strategy',
        description: 'Strategic content calendar aligned with platform trends, campaigns, and your business goals.',
      },
      {
        title: 'Video Production',
        description: 'Professional video content including product showcases, tutorials, and promotional clips.',
      },
      {
        title: 'Content Audit & Optimization',
        description: 'Analysis of existing content performance with recommendations for improvement.',
      },
      {
        title: 'Multi-Platform Adaptation',
        description: 'Content optimized for each platform—TikTok, Shopee, Instagram, and more.',
      },
    ],
    process: [
      { step: 1, title: 'Brief', description: 'Understand brand voice and content goals' },
      { step: 2, title: 'Create', description: 'Produce high-quality content assets' },
      { step: 3, title: 'Optimize', description: 'Adapt content for each platform' },
      { step: 4, title: 'Analyze', description: 'Track performance and refine strategy' },
    ],
    results: [
      { number: '5000', label: 'Videos Produced', suffix: '+' },
      { number: '10', label: 'Total Views', suffix: 'M+' },
      { number: '3', label: 'Average Engagement Lift', suffix: 'x' },
    ],
  },
  'affiliate-kol': {
    title: 'Affiliate & KOL Management',
    tagline: 'Leverage influencer power to amplify your brand reach',
    category: 'Influencer',
    description: 'Our Affiliate & KOL Management service connects your brand with the right influencers and manages your affiliate program for maximum ROI. We handle everything from influencer recruitment to performance tracking and commission management.',
    features: [
      {
        title: 'Affiliate Program Management',
        description: 'End-to-end management of your affiliate network including recruitment, onboarding, and payouts.',
      },
      {
        title: 'Influencer Recruitment & Vetting',
        description: 'Identify and vet influencers that align with your brand values and target audience.',
      },
      {
        title: 'Sales-Based Content Execution',
        description: 'Performance-driven content campaigns with measurable sales outcomes.',
      },
      {
        title: 'Performance Tracking',
        description: 'Real-time dashboards and reports to monitor KOL performance and ROI.',
      },
    ],
    process: [
      { step: 1, title: 'Match', description: 'Find the right influencers for your brand' },
      { step: 2, title: 'Brief', description: 'Align on campaign goals and content' },
      { step: 3, title: 'Execute', description: 'Launch and manage campaigns' },
      { step: 4, title: 'Report', description: 'Analyze results and optimize' },
    ],
    results: [
      { number: '5000', label: 'Managed KOLs', suffix: '+' },
      { number: '1000', label: 'Creator Portfolio', suffix: '+' },
      { number: '150', label: 'Average ROAS', suffix: '%' },
    ],
  },
  'live-streaming': {
    title: 'Live Streaming',
    tagline: 'Drive real-time sales with professional live commerce',
    category: 'Commerce',
    description: 'Our Live Streaming service provides everything you need for successful live commerce—from professional studio facilities to trained hosts and strategic planning. We help you engage customers in real-time and convert viewers into buyers.',
    features: [
      {
        title: 'Live Setting & Production',
        description: 'Professional studio setup with high-quality lighting, cameras, and streaming equipment.',
      },
      {
        title: 'Live Shopping Operation',
        description: 'End-to-end live commerce operations including product staging and order management.',
      },
      {
        title: 'Live Strategy & Planning',
        description: 'Strategic session planning aligned with campaigns, promotions, and peak shopping times.',
      },
      {
        title: 'Host Training & Management',
        description: 'Professional host training and management for engaging, sales-driven streams.',
      },
    ],
    process: [
      { step: 1, title: 'Plan', description: 'Develop streaming strategy and schedule' },
      { step: 2, title: 'Prepare', description: 'Set up studio and train hosts' },
      { step: 3, title: 'Stream', description: 'Execute professional live sessions' },
      { step: 4, title: 'Optimize', description: 'Analyze and improve performance' },
    ],
    results: [
      { number: '12', label: 'Studio Facilities', suffix: '+' },
      { number: '500', label: 'Live Sessions', suffix: '+' },
      { number: '5', label: 'Conversion vs Static', suffix: 'x' },
    ],
  },
};

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = params;
  const supabase = await createClient();

  // Try finding in database
  const { data: dbService } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  let serviceData: ServiceDetailData | null = null;

  if (dbService) {
    const rawFeatures = Array.isArray(dbService.features)
      ? dbService.features
      : typeof dbService.features === 'string'
      ? JSON.parse(dbService.features || '[]')
      : [];

    const parsedFeatures = rawFeatures.map((f: string | { title: string; description: string }) => {
      if (typeof f === 'string') {
        return { title: f, description: '' };
      }
      return f;
    });

    const rawGallery: string[] = Array.isArray(dbService.gallery)
      ? dbService.gallery
      : typeof dbService.gallery === 'string'
      ? JSON.parse(dbService.gallery || '[]')
      : [];

    const defaultFallback = defaultServicesData[slug];

    serviceData = {
      title: dbService.name,
      tagline: dbService.tagline || dbService.short_description || defaultFallback?.tagline || `Empower your brand with ${dbService.name}`,
      category: dbService.category || (dbService.icon === 'store' ? 'Performance' : dbService.icon === 'video' ? 'Creative' : dbService.icon === 'live' ? 'Commerce' : dbService.icon === 'users' ? 'Influencer' : 'Digital'),
      description: dbService.full_description || dbService.short_description || defaultFallback?.description || '',
      features: parsedFeatures.length > 0 ? parsedFeatures : (defaultFallback?.features || []),
      process: defaultFallback?.process || [
        { step: 1, title: 'Consultation', description: 'Understand your brand goals and requirements' },
        { step: 2, title: 'Strategy', description: 'Formulate a custom execution plan' },
        { step: 3, title: 'Execution', description: 'Implement with high performance and quality' },
        { step: 4, title: 'Optimization', description: 'Continuously analyze and scale results' },
      ],
      results: defaultFallback?.results || [
        { number: '100', label: 'Client Satisfaction', suffix: '%' },
        { number: '2', label: 'Growth Multiplier', suffix: 'x' },
      ],
      gallery: rawGallery,
    };
  } else if (defaultServicesData[slug]) {
    serviceData = defaultServicesData[slug];
  }

  if (!serviceData) {
    notFound();
  }

  return <ServiceDetailClient service={serviceData} slug={slug} />;
}
