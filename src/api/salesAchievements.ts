import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getSalesAchievements = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.salesAchievements, { params, signal });
};

export const useGetSalesAchievements = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.salesAchievements, params],
    queryFn: ({ signal }) => getSalesAchievements(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
