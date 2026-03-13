import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getSalesAchievementsTotal = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.salesAchievementsTotal, { params, signal });
};

export const useGetSalesAchievementsTotal = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.salesAchievementsTotal, params],
    queryFn: ({ signal }) => getSalesAchievementsTotal(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
