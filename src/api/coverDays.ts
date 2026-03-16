import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getCoverDays = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.coverDays, { params });
};

export const useGetCoverDays = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.coverDays, params],
    queryFn: () => getCoverDays(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
