import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getAllFilters = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.filters, { params, signal });
};

export const useGetAllFilters = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.filters, params],
    queryFn: ({ signal }) => getAllFilters(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
