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
  productInventoryAvailable: '/product-inventory/available',
  productInventoryRequired: '/product-inventory/required',
  productInventoryVsTarget: '/product-inventory/vs-target',
  productInventoryBranchWise: '/product-inventory/branch-wise',
  filters: '/filters',
  saleSummaryTotal: '/sales-summary/total',
  dailySalesAvg: '/daily-sales-avg',
  mtdSalesDetail: '/mtd-sales-detail',
  perDaySales: '/per-day-sales',
  saleGrowthNational: '/sales-growth-national',
  saleGrowthNationalTable: '/sales-growth-national/table',
  salesBranchWise: '/sales-branch-wise',
  salesBranchWiseTable: '/sales-branch-wise/table',
  salesAchievements: '/sales-achievements',
  salesAchievementsTotal: '/sales-achievements/total',
  sales: '/sales',
  rdSalesDetail: '/rd-sales/detail',
  rdSalesGrowth: '/rd-sales/growth',
} as const;

export type ApiEndpoints = typeof ApiEndpoints;
