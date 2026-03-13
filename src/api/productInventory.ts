import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getProductInventoryAvailable = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.productInventoryAvailable, { params, signal });
};

export const useGetProductInventoryAvailable = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.productInventoryAvailable, params],
    queryFn: ({ signal }) => getProductInventoryAvailable(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};

const getProductInventoryRequired = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.productInventoryRequired, { params, signal });
};

export const useGetProductInventoryRequired = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.productInventoryRequired, params],
    queryFn: ({ signal }) => getProductInventoryRequired(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
