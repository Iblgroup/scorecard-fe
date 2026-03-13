import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getSalesGrowthNationalTable = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.saleGrowthNationalTable, { params, signal });
};

export const useGetSalesGrowthNationalTable = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.saleGrowthNationalTable, params],
    queryFn: ({ signal }) => getSalesGrowthNationalTable(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
