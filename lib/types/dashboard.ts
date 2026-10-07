// TypeScript types for the BIZHIVE Internal Dashboard

// ============================================
// User & Auth Types
// ============================================
export type UserRole = 'admin' | 'spv' | 'regular';

export interface DashboardUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================
// Brand Types
// ============================================
export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  platform: 'shopee' | 'tiktok' | 'both';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrandFormData {
  name: string;
  logo_url?: string;
  platform: 'shopee' | 'tiktok' | 'both';
}

// ============================================
// Project Types
// ============================================
export type ProjectStatus = 'hold' | 'ongoing' | 'review' | 'revisi' | 'done';

export interface Project {
  id: string;
  brand_id: string;
  name: string;
  platform: string;
  status: ProjectStatus;
  start_date?: string;
  deadline?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  brand?: Brand;
  divisions?: ProjectDivision[];
}

export interface ProjectFormData {
  brand_id: string;
  name: string;
  platform: string;
  status: ProjectStatus;
  start_date?: string;
  deadline?: string;
  notes?: string;
}

// ============================================
// Project Division Types
// ============================================
export type DivisionType = 'ads' | 'content_creator' | 'affiliate' | 'kol';

export interface ProjectDivision {
  id: string;
  project_id: string;
  division: DivisionType;
  pic_name?: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// ============================================
// Shopee Daily Metrics Types
// ============================================
export type AdType = 'product_ads' | 'shop_ads';

export interface ShopeeDailyMetrics {
  id: string;
  project_id: string;
  date: string;
  ad_type: AdType;
  expense: number;
  impressions: number;
  clicks: number;
  conversions: number;
  products_sold: number;
  direct_gmv: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ShopeeDailyFormData {
  project_id: string;
  date: string;
  ad_type: AdType;
  expense: number;
  impressions: number;
  clicks: number;
  conversions: number;
  products_sold: number;
  direct_gmv: number;
}

// Calculated fields (not stored, computed on display)
export interface ShopeeDailyCalculated extends ShopeeDailyMetrics {
  ctr: number;      // clicks / impressions * 100
  cpc: number;      // expense / clicks
  roas: number;     // direct_gmv / expense
  cost_per_purchase: number; // expense / conversions
  cr: number;       // conversions / clicks * 100
}

// ============================================
// Shopee Monthly Summary Types
// ============================================
export type HealthStatus = 'sangat_baik' | 'baik' | 'perlu_perbaikan';

export interface ShopeeMonthly {
  id: string;
  project_id: string;
  month_year: string; // '2026-08'
  placed_order: number;
  confirmed_order: number;
  roi_target?: number;
  campaign_target: number;
  campaign_actual: number;
  shop_deco_target: number;
  shop_deco_actual: number;
  flash_sale_target: number;
  flash_sale_actual: number;
  broadcast_target: number;
  broadcast_actual: number;
  voucher_target: number;
  voucher_actual: number;
  ads_keyword_spend: number;
  health_status: HealthStatus;
  penalty_points: number;
  penalty_detail?: string;
  failed_metrics: number;
  summary_text?: string;
  next_plan_text?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// TikTok Objective Types
// ============================================
export type TikTokObjective = 'reach' | 'views' | 'traffics' | 'product_live';

export interface TikTokObjectiveData {
  id: string;
  project_id: string;
  date: string;
  objective: TikTokObjective;
  budget_estimated: number;
  actual_spend: number;
  kpi_1_label?: string;
  kpi_1_value?: number;
  kpi_2_label?: string;
  kpi_2_value?: number;
  result?: number;
  status: ProjectStatus;
  note?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Dashboard Overview Types
// ============================================
export interface DashboardOverview {
  total_brands: number;
  total_projects: number;
  projects_by_status: Record<ProjectStatus, number>;
  upcoming_deadlines: Project[];
  recent_alerts: ProjectAlert[];
  workload_by_pic: WorkloadItem[];
}

export interface ProjectAlert {
  project: Project;
  type: 'deadline' | 'issue' | 'review';
  message: string;
}

export interface WorkloadItem {
  pic_name: string;
  project_count: number;
  divisions: string[];
}

// ============================================
// Utility: Status labels & colors
// ============================================
export const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  hold: { label: 'Hold', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  ongoing: { label: 'On Going', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  review: { label: 'Review', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  revisi: { label: 'Revisi', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  done: { label: 'Done', color: 'text-green-600', bgColor: 'bg-green-100' },
};

export const DIVISION_LABELS: Record<DivisionType, string> = {
  ads: 'Ads',
  content_creator: 'Content Creator',
  affiliate: 'Affiliate',
  kol: 'KOL',
};

export const AD_TYPE_LABELS: Record<AdType, string> = {
  product_ads: 'Product Ads',
  shop_ads: 'Shop Ads',
};

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  sangat_baik: 'Sangat Baik',
  baik: 'Baik',
  perlu_perbaikan: 'Perlu Perbaikan',
};
