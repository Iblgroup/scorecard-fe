import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getProductInventoryVsTarget = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.productInventoryVsTarget, { params, signal });
};

export const useGetProductInventoryVsTarget = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.productInventoryVsTarget, params],
    queryFn: ({ signal }) => getProductInventoryVsTarget(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};

const getProductInventoryBranchWise = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.productInventoryBranchWise, { params, signal });
};

export const useGetProductInventoryBranchWise = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.productInventoryBranchWise, params],
    queryFn: ({ signal }) => getProductInventoryBranchWise(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
