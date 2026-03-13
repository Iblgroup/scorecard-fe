import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getPerDaySales = async (params?: Record<string, unknown>, signal?: AbortSignal) => {
  return axios.get(ApiEndpoints.perDaySales, { params, signal });
};

export const useGetPerDaySales = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.perDaySales, params],
    queryFn: ({ signal }) => getPerDaySales(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
