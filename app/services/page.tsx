import { createClient } from '@/lib/supabase/server';
import ServicesPageClient, { ServiceItem } from './ServicesPageClient';

// Fallback services if table is empty
const defaultServices: ServiceItem[] = [
  {
    title: 'Shop Optimization',
    slug: 'shop-optimization',
    category: 'Performance',
    description: 'Maximize your e-commerce store performance with data-driven strategies and precise targeting.',
    icon: 'store',
    features: ['Website Analysis', 'Ads Optimization', 'Campaign Marketing'],
    highlight: { number: '24%', label: 'Revenue Lift' }
  },
  {
    title: 'Content Production',
    slug: 'content-production',
    category: 'Creative',
    description: 'Engaging product videos and lifestyle content optimized for TikTok, Shopee, and Instagram.',
    icon: 'video',
    features: ['Video Production', 'Content Strategy', 'Multi-Platform adaptation'],
    highlight: { number: '5k+', label: 'Videos Made' }
  },
  {
    title: 'Affiliate & KOL',
    slug: 'affiliate-kol',
    category: 'Influencer',
    description: 'Performance-driven influencer marketing and affiliate network management.',
    icon: 'users',
    features: ['Influencer Vetting', 'Performance Tracking', 'Program Management'],
    highlight: { number: '5k+', label: 'Active KOLs' }
  },
  {
    title: 'Live Streaming',
    slug: 'live-streaming',
    category: 'Commerce',
    description: 'Professional live shop operation with trained hosts and state-of-the-art studio facilities.',
    icon: 'live',
    features: ['Professional Hosts', 'Studio Rental', 'Strategic Planning'],
    highlight: { number: '12+', label: 'Live Studios' }
  }
];

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: dbServices } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true });

  let servicesList: ServiceItem[] = [];

  if (dbServices && dbServices.length > 0) {
    servicesList = dbServices.map(s => ({
      id: s.id,
      title: s.name,
      slug: s.slug,
      category: s.icon === 'store' ? 'Performance' : s.icon === 'video' ? 'Creative' : s.icon === 'live' ? 'Commerce' : s.icon === 'users' ? 'Influencer' : 'Digital',
      description: s.short_description || '',
      icon: s.icon || 'store',
      features: Array.isArray(s.features) ? s.features : typeof s.features === 'string' ? JSON.parse(s.features || '[]') : [],
      highlight: null,
    }));
  } else {
    servicesList = defaultServices;
  }

  return <ServicesPageClient services={servicesList} />;
}
