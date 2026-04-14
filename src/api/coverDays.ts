import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getCoverDays = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.coverDays, { params });
};

const getCoverDaysTotal = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.coverDaysTotal, { params });
};

export const useGetCoverDays = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.coverDays, params],
    queryFn: () => getCoverDays(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCoverDaysTotal = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.coverDaysTotal, params],
    queryFn: () => getCoverDaysTotal(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
