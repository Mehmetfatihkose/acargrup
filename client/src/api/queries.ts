import { useQuery, useMutation } from '@tanstack/react-query';
import { apiGet, apiPost } from './client';
import type {
  Project,
  Product,
  Milestone,
  NewsItem,
  CertificateItem,
  StatItem,
  ContactPayload,
  QuotePayload,
} from './types';
import { placeholderStats } from '../lib/fallbackData';

export function useProjects(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category && category !== 'Tümü') params.set('category', category);
  if (search && search.trim()) params.set('search', search.trim());
  const qs = params.toString();

  return useQuery({
    queryKey: ['projects', category || 'Tümü', search || ''],
    queryFn: () => apiGet<Project[]>(`/projects${qs ? `?${qs}` : ''}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => apiGet<Project>(`/projects/${slug}`),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiGet<Product[]>('/products'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiGet<Product>(`/products/${slug}`),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMilestones() {
  return useQuery({
    queryKey: ['milestones'],
    queryFn: () => apiGet<Milestone[]>('/milestones'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => apiGet<NewsItem[]>('/news'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewsItem(slug: string | undefined) {
  return useQuery({
    queryKey: ['news-item', slug],
    queryFn: () => apiGet<NewsItem>(`/news/${slug}`),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => apiGet<StatItem[]>('/stats'),
    placeholderData: placeholderStats,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCertificates() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: () => apiGet<CertificateItem[]>('/certificates'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => apiGet<Record<string, string>>('/settings'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: (payload: ContactPayload) => apiPost('/contact', payload),
  });
}

export function useSubmitQuote() {
  return useMutation({
    mutationFn: (payload: QuotePayload) => apiPost('/quote', payload),
  });
}

