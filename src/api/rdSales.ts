import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getRdSalesDetail = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.rdSalesDetail, { params });
};

export const useGetRdSalesDetail = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.rdSalesDetail, params],
    queryFn: () => getRdSalesDetail(params),
    placeholderData: keepPreviousData,
  });
};

const getRdSalesGrowth = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.rdSalesGrowth, { params });
};

export const useGetRdSalesGrowth = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.rdSalesGrowth, params],
    queryFn: () => getRdSalesGrowth(params),
    placeholderData: keepPreviousData,
  });
};
