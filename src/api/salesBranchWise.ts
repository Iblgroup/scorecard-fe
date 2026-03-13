import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getSalesBranchWise = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.salesBranchWise, { params, signal });
};

export const useGetSalesBranchWise = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.salesBranchWise, params],
    queryFn: ({ signal }) => getSalesBranchWise(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
