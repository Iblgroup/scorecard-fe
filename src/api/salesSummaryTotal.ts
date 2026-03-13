import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getSalesSummaryTotal = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.saleSummaryTotal, { params, signal });
};

export const useGetSalesSummaryTotal = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.saleSummaryTotal, params],
    queryFn: ({ signal }) => getSalesSummaryTotal(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
