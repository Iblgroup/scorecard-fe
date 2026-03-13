import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getSalesGrowthNational = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.saleGrowthNational, { params, signal });
};

export const useGetSalesGrowthNational = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.saleGrowthNational, params],
    queryFn: ({ signal }) => getSalesGrowthNational(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
