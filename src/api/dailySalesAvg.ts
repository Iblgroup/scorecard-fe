import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getDailySalesAvg = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.dailySalesAvg, { params });
};

export const useGetDailySalesAvg = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.dailySalesAvg, params],
    queryFn: () => getDailySalesAvg(params),
    placeholderData: keepPreviousData,
  });
};
