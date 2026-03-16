import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getForecastAccuracyMonthly = async (params?: Record<string, unknown>) => {
  return axios.get(ApiEndpoints.forecastAccuracyMonthly, { params });
};

export const useGetForecastAccuracyMonthly = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.forecastAccuracyMonthly, params],
    queryFn: () => getForecastAccuracyMonthly(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
