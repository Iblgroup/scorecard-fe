import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getMtdSalesDetail = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.mtdSalesDetail, { params });
};

export const useGetMtdSalesDetail = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.mtdSalesDetail, params],
    queryFn: () => getMtdSalesDetail(params),
    placeholderData: keepPreviousData,
  });
};
