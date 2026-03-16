import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getInventoryDays = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.inventoryDays, { params });
};

export const useGetInventoryDays = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.inventoryDays, params],
    queryFn: () => getInventoryDays(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
