import axios from '@/config/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiEndpoints } from '@/api/endpoints';
import { ApiKey } from '@/utils/enum';

// Row shape returned by GET /rd-status — mirrors the franchise stock query.
export interface RdStatusApiRow {
  ibl_distributor_code: string | number;
  distributor_desc: string | null;
  branch_code: string | number | null;
  branch_desc: string | null;
  stock_qty: string | number;
  stock_value: string | number;
  last_stock_qty: string | number;
  last_stock_value: string | number;
  last_stock_date: string | null;
  day_diff: string | number;
}

// No parameters. The endpoint reports the CURRENT stock position: its source,
// primary_secondary_stock, is a latest-snapshot view holding one row per RD
// with no history behind it, so there is no earlier date to ask for. /rd-status
// still validates a ?date= for older clients but ignores it and answers as of
// today either way — which is why nothing is sent.
const getRdStatus = async () => {
  return axios.get(ApiEndpoints.rdStatus);
};

// Fires on mount, not on tab switch: the underlying query takes ~12s, so it
// is prefetched while the user is on another tab and the RD Status tab opens
// against a warm cache. The key is constant, so the dashboard and the filter
// bar share one request.
export const useGetRdStatus = () => {
  return useQuery({
    queryKey: [ApiKey.rdStatus],
    queryFn: getRdStatus,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
