import { ApiEndpoints } from '@/api/endpoints';
import axios from '@/config/axios';
import { ApiKey } from '@/utils/enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const getSalesBranchWiseTable = async (
  params?: Record<string, unknown>,
  signal?: AbortSignal
) => {
  return axios.get(ApiEndpoints.salesBranchWiseTable, { params, signal });
};

export const useGetSalesBranchWiseTable = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.salesBranchWise, params],
    queryFn: ({ signal }) => getSalesBranchWiseTable(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
