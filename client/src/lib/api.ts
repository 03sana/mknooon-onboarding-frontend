/**
 * API Service for Mknooon Onboarding
 * Handles all communication with the Laravel backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface Brand {
  src: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  color_primary: string;
  color_accent: string;
  logo: string;
  video_url: string;
}

export interface PricingData {
  src: string;
  country: string;
  price: number;
  currency: string;
  currency_symbol: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, unknown>;
}

/**
 * Fetch brand data from the backend
 */
export async function fetchBrand(src: string): Promise<ApiResponse<Brand>> {
  try {
    const response = await fetch(`${API_BASE_URL}/brand?src=${encodeURIComponent(src)}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch brand data',
    };
  }
}

/**
 * Fetch available countries for a brand
 */
export async function fetchCountries(src: string): Promise<ApiResponse<{ src: string; countries: string[] }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/countries?src=${encodeURIComponent(src)}`);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch countries',
    };
  }
}

/**
 * Fetch pricing data for a specific brand and country
 */
export async function fetchPrice(src: string, country: string): Promise<ApiResponse<PricingData>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/price?src=${encodeURIComponent(src)}&country=${encodeURIComponent(country)}`
    );
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch pricing data',
    };
  }
}

/**
 * Normalize src parameter (lowercase)
 */
export function normalizeSrc(src: string): string {
  return src.toLowerCase().trim();
}

/**
 * Normalize country parameter (uppercase)
 */
export function normalizeCountry(country: string): string {
  return country.toUpperCase().trim();
}
