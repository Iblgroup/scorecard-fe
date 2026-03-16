import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getDispatchVsOrder = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.dispatchVsOrder, { params });
};

export const useGetDispatchVsOrder = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.dispatchVsOrder, params],
    queryFn: () => getDispatchVsOrder(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
