import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getForecastAccuracyCategoryMonthly = async (
  params?: Record<string, unknown>
) => {
  return axios.get(ApiEndpoints.forecastAccuracyCategoryMonthly, { params });
};

export const useGetForecastAccuracyCategoryMonthly = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.forecastAccuracyCategoryMonthly, params],
    queryFn: () => getForecastAccuracyCategoryMonthly(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
