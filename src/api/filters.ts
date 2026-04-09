import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

interface FilterParams {
  classification?: string;
  sku?: string;
}

const getFilters = async (params: FilterParams) => {
  return axios.get(ApiEndpoints.filters, { params });
};

export const useGetFilters = (params: FilterParams = {}) => {
  return useQuery({
    queryKey: [ApiKey.filters, params],
    queryFn: () => getFilters(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};

const getFilterBranches = async (params: FilterParams) => {
  return axios.get(ApiEndpoints.filterBranches, { params });
};

export const useGetFilterBranches = (params: FilterParams = {}) => {
  return useQuery({
    queryKey: [ApiKey.filters, 'branches', params],
    queryFn: () => getFilterBranches(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
