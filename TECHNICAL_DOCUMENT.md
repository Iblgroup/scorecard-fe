# Technical Document — Searle Scorecard Platform

**Project:** SEARLE Supply Chain Scorecard
**Date:** April 1, 2026
**Prepared by:** Development Team

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Backend API Endpoints](#2-backend-api-endpoints)
   - 2.1 Sales Summary
   - 2.2 Cover Days
   - 2.3 Forecast Accuracy Monthly
   - 2.4 Forecast Accuracy Yearly
   - 2.5 Forecast Accuracy Category Monthly
   - 2.6 Forecast Accuracy Category Yearly
   - 2.7 Inventory Days
   - 2.8 Above / Below Threshold
   - 2.9 IBL vs TSCL
   - 2.10 Service Measure
   - 2.11 Target vs Actual
   - 2.12 Dispatch vs Order
   - 2.13 WIP
   - 2.14 RPM
   - 2.15 Filters
   - 2.16 Total SKU
   - 2.17 Health & Info
3. [Frontend Dashboard](#3-frontend-dashboard)
   - Tab 1 — Supply Chain
   - Tab 2 — Service Measure
   - Tab 3 — Dispatch & WIP
4. [Global Filter Bar](#4-global-filter-bar)
5. [Backend ↔ Frontend Mapping](#5-backend--frontend-mapping)
6. [Branch Reference](#6-branch-reference)
7. [Database Tables](#7-database-tables)

---

## 1. Tech Stack

### Backend

| Layer         | Technology              | Version   |
|---------------|-------------------------|-----------|
| Runtime       | Node.js                 | —         |
| Framework     | Express                 | ^4.18.2   |
| ORM           | Sequelize               | ^6.35.2   |
| Database      | PostgreSQL               | —         |
| Port          | `3005`                  | —         |
| Base URL      | `/api`                  | —         |

### Frontend

| Layer            | Technology                    | Version    |
|------------------|-------------------------------|------------|
| UI Framework     | React                         | 18.3.1     |
| Language         | TypeScript                    | 5.7.3      |
| Build Tool       | Vite                          | 6.0.7      |
| Component Library| Chakra UI                     | 3.31.0     |
| Data Fetching    | TanStack React Query          | 5.62.12    |
| State Management | Redux Toolkit                 | 2.11.2     |
| HTTP Client      | Axios                         | 1.7.9      |
| Routing          | React Router                  | 7.1.3      |
| Charts           | Recharts                      | 3.7.0      |
| Date Picker      | React DatePicker              | 9.1.0      |
| Excel Export     | XLSX (SheetJS)                | 0.18.5     |

---

## 2. Backend API Endpoints

**Base URL:** `/api`
**Technology:** Node.js · Express · Sequelize · PostgreSQL
**Port:** `3005`

### Common Query Parameters

All endpoints accept the following query parameters unless noted otherwise:

| Parameter        | Type              | Description                                        |
|------------------|-------------------|----------------------------------------------------|
| `startDate`      | `string`          | Start of date range (YYYY-MM-DD)                   |
| `endDate`        | `string`          | End of date range (YYYY-MM-DD)                     |
| `classification` | `string / string[]` | Product class filter — `A`, `B`, `C`, `Others`  |
| `sku`            | `string / string[]` | SKU code filter — single value or array          |
| `branch`         | `string / string[]` | Branch code filter — single value or array       |

---

### 2.1 Sales Summary — `/api/sales-summary`

| Method | Endpoint              | Description                                                                 |
|--------|-----------------------|-----------------------------------------------------------------------------|
| GET    | `/api/sales-summary`  | Sales by classification (A/B/C/Others) — SKU count, RD sales, OPS sales, total |

---

### 2.2 Cover Days — `/api/cover-days`

| Method | Endpoint           | Description                                                                   |
|--------|--------------------|-------------------------------------------------------------------------------|
| GET    | `/api/cover-days`  | Cover days analysis by classification — inventory value and daily target rate  |

---

### 2.3 Forecast Accuracy Monthly — `/api/forecast-accuracy-monthly`

| Method | Endpoint                          | Description                                                      |
|--------|-----------------------------------|------------------------------------------------------------------|
| GET    | `/api/forecast-accuracy-monthly`  | Monthly forecast accuracy % — sales achieved vs IBL target       |

---

### 2.4 Forecast Accuracy Yearly — `/api/forecast-accuracy-yearly`

| Method | Endpoint                         | Description                                                       |
|--------|----------------------------------|-------------------------------------------------------------------|
| GET    | `/api/forecast-accuracy-yearly`  | YTD forecast accuracy % — cumulative sales achieved vs IBL target |

---

### 2.5 Forecast Accuracy Category Monthly — `/api/forecast-accuracy-category-monthly`

| Method | Endpoint                                   | Description                                                        |
|--------|--------------------------------------------|--------------------------------------------------------------------|
| GET    | `/api/forecast-accuracy-category-monthly`  | Forecast accuracy % per classification for the last 3 months       |

> Uses `endDate` only. Computes a rolling 3-month window automatically.

---

### 2.6 Forecast Accuracy Category Yearly — `/api/forecast-accuracy-category-yearly`

| Method | Endpoint                                  | Description                                                         |
|--------|-------------------------------------------|---------------------------------------------------------------------|
| GET    | `/api/forecast-accuracy-category-yearly`  | Forecast accuracy % per classification for the last 3 months (YTD) |

> Uses `endDate` only. Rolling 3-month window. Collapses SD + OPS rows before joining budget to prevent double-counting.

---

### 2.7 Inventory Days — `/api/inventory-days`

| Method | Endpoint               | Description                                                                      |
|--------|------------------------|----------------------------------------------------------------------------------|
| GET    | `/api/inventory-days`  | Inventory days per classification and item broken down by all 14 branch locations |

Returns rows grouped by classification (A / B / C / Others) and item description, with one column per branch.

---

### 2.8 Above / Below Threshold — `/api/above-below-threshold`

| Method | Endpoint                       | Description                                                                        |
|--------|--------------------------------|------------------------------------------------------------------------------------|
| GET    | `/api/above-below-threshold`   | Count of SKUs above and below cover-day benchmarks per classification              |

Benchmarks used:

| Classification | Threshold (days) |
|----------------|-----------------|
| A              | 30              |
| B              | 20              |
| C              | 15              |

---

### 2.9 IBL vs TSCL — `/api/ibl-vs-tscl`

| Method | Endpoint           | Description                                                                          |
|--------|--------------------|--------------------------------------------------------------------------------------|
| GET    | `/api/ibl-vs-tscl` | IBL primary target vs TSCL budget — absolute values, difference, and percentage gap  |

Returns `Total`, `A`, `B`, `C`, `Others` classification rows. Branch filter applies to IBL target only (TSCL is a budget table).

---

### 2.10 Service Measure — `/api/service-measure`

| Method | Endpoint               | Description                                                                    |
|--------|------------------------|--------------------------------------------------------------------------------|
| GET    | `/api/service-measure` | % of SKUs at or above the cover-days threshold per branch, by classification   |

---

### 2.11 Target vs Actual — `/api/tgt-vs-actual`

| Method | Endpoint             | Description                                                              |
|--------|----------------------|--------------------------------------------------------------------------|
| GET    | `/api/tgt-vs-actual` | Closing inventory vs target cover days, by classification                |

---

### 2.12 Dispatch vs Order — `/api/dispatch-vs-order`

| Method | Endpoint                  | Description                                                          |
|--------|---------------------------|----------------------------------------------------------------------|
| GET    | `/api/dispatch-vs-order`  | Delivery quantity vs order quantity with fulfillment % by material   |

---

### 2.13 WIP — `/api/wip`

| Method | Endpoint    | Description                                               |
|--------|-------------|-----------------------------------------------------------|
| GET    | `/api/wip`  | Work-in-progress inventory by material with total value   |

---

### 2.14 RPM — `/api/rpm`

| Method | Endpoint    | Description                                                      |
|--------|-------------|------------------------------------------------------------------|
| GET    | `/api/rpm`  | Raw material procurement — valuated stock inventory by material  |

---

### 2.15 Filters — `/api/filters`

| Method | Endpoint        | Description                                                    |
|--------|-----------------|----------------------------------------------------------------|
| GET    | `/api/filters`  | Available filter values — SKU list and branch list             |

| Parameter        | Type              | Description                           |
|------------------|-------------------|---------------------------------------|
| `classification` | `string / string[]` | Pre-filter SKUs by classification   |
| `sku`            | `string / string[]` | Pre-filter branches by SKU          |

---

### 2.16 Total SKU — `/api/total-sku`

| Method | Endpoint           | Description                                     |
|--------|--------------------|-------------------------------------------------|
| GET    | `/api/total-sku`   | Total SKU count grouped by classification       |

| Parameter        | Type              | Description                        |
|------------------|-------------------|------------------------------------|
| `classification` | `string / string[]` | Filter by classification         |
| `sku`            | `string / string[]` | Filter by specific SKUs          |

---

### 2.17 Health & Info

| Method | Endpoint    | Description                                          |
|--------|-------------|------------------------------------------------------|
| GET    | `/`         | API info, version, and list of available endpoints   |
| GET    | `/health`   | Health check — returns status, timestamp, environment |

---

**Total API Endpoints: 18**

---

## 3. Frontend Dashboard

**Main Component:** `ScorecardDashboard.tsx`
**Technology:** React 18 · TypeScript · Chakra UI v3 · React Query · Recharts

The dashboard is a **single-page tabbed interface** with three main tabs. All tabs share a global filter bar and use React Query hooks with **5-minute stale time** and `keepPreviousData` for smooth filter transitions.

---

### Tab 1 — Supply Chain

**API Hooks used:** `useGetSalesSummary`, `useGetCoverDays`, `useGetForecastAccuracyMonthly`, `useGetForecastAccuracyYearly`, `useGetForecastAccuracyCategoryMonthly`, `useGetForecastAccuracyCategoryYearly`, `useGetIblVsTscl`, `useGetAboveBelowThreshold`

| Section                             | Component / Visual                  | Description                                                                      |
|-------------------------------------|-------------------------------------|----------------------------------------------------------------------------------|
| Sales Summary                       | `SalesSummaryCard`                  | Total & per-classification (A/B/C/Others) sales — RD, OPS, Total columns         |
| Cover Days                          | `CoverDaysCard`                     | Average cover days overall and per classification; shows "As of DD Mon'YY" label |
| SKUs Above / Below Threshold        | Metric badges                       | Count of SKUs meeting the A/B/C cover-day benchmarks                             |
| Budget Accuracy TSCL (Monthly)      | `ChartCard` + line chart            | Monthly forecast accuracy % — IBL vs TSCL                                        |
| Forecast Accuracy IBL (YTD)         | `ChartCard` + line chart            | YTD cumulative accuracy % — IBL                                                  |
| Forecast vs Budget % (IBL vs TSCL)  | `BarChart`                          | Per-classification comparison bar chart (Total → A → B → C), `showTotal` active  |
| Category Forecast Accuracy Monthly  | `BarChart`                          | Last 3 months accuracy % by classification (grouped bars)                        |
| Category Forecast Accuracy Yearly   | `BarChart`                          | Last 3 months YTD accuracy % by classification (grouped bars)                    |

---

### Tab 2 — Service Measure

**API Hooks used:** `useGetInventoryDays`, `useGetAboveBelowThreshold`, `useGetServiceMeasure`, `useGetTgtVsActual`

| Section                     | Component / Visual         | Description                                                                           |
|-----------------------------|----------------------------|---------------------------------------------------------------------------------------|
| Inventory Days Table        | `DataTable` (collapsible)  | Days of stock per classification / item across all 14 branches; Total column + Total row before Others |
| SKUs Above Threshold        | Metric badges              | Per-classification count of SKUs meeting benchmark cover days                         |
| Service Measure by Branch   | `ServiceMeasureChart`      | % of SKUs at or above threshold per branch — bar chart view                           |
| Target vs Actual            | `DataTable`                | Closing inventory vs target cover days by classification                              |

Inventory Days table features:
- Rows grouped by **A → B → C → Total (A+B+C ÷ 3) → Others**
- Classification badge (color-coded) in first column
- Each branch is a column; a **Total** column averages across all branches
- Cover-day benchmarks shown in `BenchmarkBanner` (hidden when SKU filter active)
- Row expand (`+`) shows individual SKU sub-rows per classification

---

### Tab 3 — Dispatch & WIP

**API Hooks used:** `useGetDispatchVsOrder`, `useGetWip`, `useGetRpm`

| Section          | Component / Visual  | Description                                                              |
|------------------|---------------------|--------------------------------------------------------------------------|
| Dispatch vs Order | `DataTable`        | Delivery qty vs order qty by material — fulfillment % column             |
| WIP               | `DataTable`        | Work-in-progress stock by material with total inventory value            |
| RPM               | `DataTable`        | Raw material procurement — valuated stock per material                   |

---

## 4. Global Filter Bar

All tabs share a common filter bar rendered via the `FilterBar` component.

| Filter           | Type              | Applies To       | Notes                                              |
|------------------|-------------------|------------------|----------------------------------------------------|
| Date From        | Date picker       | All tabs         | Paired date range                                  |
| Date To          | Date picker       | All tabs         | Drives "As of" label in Cover Days card            |
| Classification   | Multi-select      | All tabs         | Options: A · B · C                                 |
| SKU              | Multi-select      | All tabs         | Options driven by `/api/filters` response          |
| Branch           | Multi-select      | All tabs         | Options driven by `/api/filters` response          |

> When the **SKU** filter is active, the `BenchmarkBanner` inside the Inventory Days table is hidden.

---

## 5. Backend ↔ Frontend Mapping

| Frontend Tab / Section              | API Endpoint(s) Used                                                                                        |
|-------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Sales Summary Card                  | `/api/sales-summary`                                                                                        |
| Cover Days Card                     | `/api/cover-days`                                                                                           |
| SKUs Above / Below Threshold        | `/api/above-below-threshold`                                                                                |
| Budget Accuracy TSCL (Monthly)      | `/api/forecast-accuracy-monthly`                                                                            |
| Forecast Accuracy IBL (YTD)         | `/api/forecast-accuracy-yearly`                                                                             |
| Forecast vs Budget % (IBL vs TSCL)  | `/api/ibl-vs-tscl`                                                                                          |
| Category Forecast Accuracy Monthly  | `/api/forecast-accuracy-category-monthly`                                                                   |
| Category Forecast Accuracy Yearly   | `/api/forecast-accuracy-category-yearly`                                                                    |
| Inventory Days Table                | `/api/inventory-days`                                                                                       |
| Service Measure Chart               | `/api/service-measure`                                                                                      |
| Target vs Actual Table              | `/api/tgt-vs-actual`                                                                                        |
| Dispatch vs Order Table             | `/api/dispatch-vs-order`                                                                                    |
| WIP Table                           | `/api/wip`                                                                                                  |
| RPM Table                           | `/api/rpm`                                                                                                  |
| Filter Bar (SKU & Branch options)   | `/api/filters`                                                                                              |
| SKU count badges                    | `/api/total-sku`                                                                                            |

---

## 6. Branch Reference

All 14 distribution branches covered by the Scorecard:

| Branch Code | Branch Name  |
|-------------|--------------|
| 8006        | Bahawalpur   |
| 8018        | DSS Korangi  |
| 8019        | Faisalabad   |
| 8023        | Gujranwala   |
| 8028        | Hyderabad    |
| 8029        | Islamabad    |
| 8035        | Karachi      |
| 8044        | Korangi      |
| 8046        | Lahore       |
| 8056        | Mingora      |
| 8059        | Multan       |
| 8070        | Peshawar     |
| 8072        | Quetta       |
| 8085        | Sukkur       |

---

## 7. Database Tables

Primary database objects referenced by the backend queries:

| Table / View                          | Used By                              | Description                                              |
|---------------------------------------|--------------------------------------|----------------------------------------------------------|
| `mv_target_sales_aggregate_25_26`     | Most endpoints                       | Main aggregate — target, actual sales, inventory         |
| `frg_sap_items_detail`                | Inventory Days, RPM, WIP             | Item master with descriptions and material codes         |
| `frg_dist_metric_prod_mapping`        | Forecast, IBL vs TSCL, Cover Days    | Product classification mapping (A / B / C)               |
| `tscl_sap_targets`                    | IBL vs TSCL, Forecast Accuracy       | TSCL budget targets by material and period               |
| `sap_wip_data`                        | WIP                                  | Work-in-progress inventory snapshot                      |
| `vw_sap_tpkg_traw_data`               | RPM                                  | SAP raw material stock data view                         |
| `vw_dispatch_vs_orders`               | Dispatch vs Order                    | Pre-computed dispatch and order quantities view          |
| `locations`                           | Inventory Days, Service Measure      | Branch location master                                   |
| `sap_locations_abr`                   | Multiple                             | Branch abbreviations for display                         |

---

*End of Document*
