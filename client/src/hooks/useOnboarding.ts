import { useEffect, useState } from 'react';
import { fetchBrand, fetchCountries, fetchPrice, Brand, PricingData, ApiResponse } from '@/lib/api';

export interface OnboardingState {
  src: string | null;
  brand: Brand | null;
  countries: string[];
  selectedCountry: string | null;
  pricing: PricingData | null;
  loading: boolean;
  error: string | null;
}

export function useOnboarding(initialSrc: string | null) {
  const [state, setState] = useState<OnboardingState>({
    src: initialSrc,
    brand: null,
    countries: [],
    selectedCountry: null,
    pricing: null,
    loading: false,
    error: null,
  });

  // Fetch brand and countries when src changes
  useEffect(() => {
    if (!state.src) return;

    const loadBrandData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [brandResponse, countriesResponse] = await Promise.all([
        fetchBrand(state.src!),
        fetchCountries(state.src!),
      ]);

      if (!brandResponse.success || !countriesResponse.success) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: brandResponse.error || countriesResponse.error || 'Failed to load data',
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        brand: brandResponse.data || null,
        countries: countriesResponse.data?.countries || [],
        loading: false,
      }));
    };

    loadBrandData();
  }, [state.src]);

  const selectCountry = (country: string) => {
    setState((prev) => ({ ...prev, selectedCountry: country }));
  };

  const fetchPricing = async (country: string) => {
    if (!state.src) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const response = await fetchPrice(state.src, country);

    if (!response.success) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: response.error || 'Failed to fetch pricing',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      pricing: response.data || null,
      loading: false,
    }));
  };

  return {
    ...state,
    selectCountry,
    fetchPricing,
  };
}
