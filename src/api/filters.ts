import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getFilters = async () => {
  return axios.get(ApiEndpoints.filters);
};

export const useGetFilters = () => {
  return useQuery({
    queryKey: [ApiKey.filters],
    queryFn: () => getFilters(),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
