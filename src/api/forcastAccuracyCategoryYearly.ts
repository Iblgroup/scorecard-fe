import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

const getForecastAccuracyCategoryYearly = async (
  params?: Record<string, unknown>
) => {
  return axios.get(ApiEndpoints.forecastAccuracyCategoryYearly, { params });
};

export const useGetForecastAccuracyCategoryYearly = (
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: [ApiKey.forecastAccuracyCategoryYearly, params],
    queryFn: () => getForecastAccuracyCategoryYearly(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
