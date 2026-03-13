import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getSalesSummary = async (params?: Record<string, unknown>, signal?: AbortSignal) => {
  return axios.get(ApiEndpoints.saleSummary, { params, signal });
};

export const useGetSalesSummary = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.saleSummary, params],
    queryFn: ({ signal }) => getSalesSummary(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
