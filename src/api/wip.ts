import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getWip = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.wip, { params });
};

export const useGetWip = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.wip, params],
    queryFn: () => getWip(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
