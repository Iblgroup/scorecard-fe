import axios from "@/config/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ApiEndpoints } from "@/api/endpoints";
import { ApiKey } from "@/utils/enum";

const getSales = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.sales, { params });
};

export const useGetSales = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [ApiKey.sales, params],
    queryFn: () => getSales(params),
    placeholderData: keepPreviousData,
  });
};
