export const ApiEndpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    profile: '/auth/profile',
    refreshToken: '/auth/refresh',
  },

  users: '/users',
  userById: (id: string | number) => `/users/${id}`,
  saleSummary: '/sales-summary',
  forecastAccuracyMonthly: '/forecast-accuracy-monthly',
  forecastAccuracyYearly: '/forecast-accuracy-yearly',
  inventoryDays: '/inventory-days',
  coverDays: '/cover-days',
  coverDaysTotal: '/cover-days/total',
  aboveBelowThreshold: '/above-below-threshold',
  forecastAccuracyCategoryMonthly: '/forecast-accuracy-category-monthly',
  forecastAccuracyCategoryYearly: '/forecast-accuracy-category-yearly',
  iblVsTscl: '/ibl-vs-tscl',
  rpm: '/rpm',
  wip: '/wip',
  filters: '/filters',
  filterBranches: '/filters/branches',
  serviceMeasure: '/service-measure',
  dispatchVsOrder: '/dispatch-vs-order',
  tgtVsActual: '/tgt-vs-actual',
  totalSku: '/total-sku',
} as const;

export type ApiEndpoints = typeof ApiEndpoints;
