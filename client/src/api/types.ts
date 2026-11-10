export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  caption: string;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: 'Demiryolu' | 'Karayolu' | 'Altyapı' | 'Bina' | string;
  sector: string;
  location: string;
  year: number;
  client: string;
  description: string;
  cover_image: string;
  budget_range: string;
  duration: string;
  created_at: string;
  images?: ProjectImage[];
  related?: Project[];
}

export interface ProductSpecs {
  code?: string;
  subtypes?: string;
  mfi?: string;
  density?: string;
  meltingTemp?: string;
  tensileStrength?: string;
  applications?: string[];
  standards?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  specs_json: string;
  specs: ProductSpecs;
  packaging: string;
  image: string;
}

export interface Milestone {
  id: number;
  year: number;
  title: string;
  description: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  published_at: string;
}

export interface CertificateItem {
  id: number;
  name: string;
  image: string;
  description: string;
}

export interface StatItem {
  id: number;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  website?: string;
}

export interface QuotePayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  product_id?: number | null;
  quantity: string;
  message?: string;
  website?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MutationResponse {
  success: boolean;
  id?: number;
  message: string;
  errors?: { field: string; message: string }[];
}

