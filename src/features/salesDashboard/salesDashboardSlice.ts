import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MainTab = 'supplyChain' | 'serviceMeasure' | 'dispatchWip'
type ViewTab = 'visualizations' | 'tables'
type DisplayMode = 'TP' | 'EFP'

interface Filters {
    classification: string
    branch: string
    sku: string
    dateFrom: string
    dateTo: string
}

interface SalesDashboardState {
    mainTab: MainTab
    activeTab: ViewTab
    displayMode: DisplayMode
    filters: Filters
}

const initialState: SalesDashboardState = {
    mainTab: 'supplyChain',
    activeTab: 'visualizations',
    displayMode: 'TP',
    filters: {
        classification: '',
        branch: '',
        sku: '',
        dateFrom: '',
        dateTo: '',
    },
}

export const salesDashboardSlice = createSlice({
    name: 'salesDashboard',
    initialState,
    reducers: {
        setMainTab: (state, action: PayloadAction<MainTab>) => {
            state.mainTab = action.payload
        },
        setActiveTab: (state, action: PayloadAction<ViewTab>) => {
            state.activeTab = action.payload
        },
        setDisplayMode: (state, action: PayloadAction<DisplayMode>) => {
            state.displayMode = action.payload
        },
        setFilter: (state, action: PayloadAction<{ key: keyof Filters; value: string }>) => {
            state.filters[action.payload.key] = action.payload.value
        },
        resetFilters: (state) => {
            state.filters = initialState.filters
        },
    },
})

export const { setMainTab, setActiveTab, setDisplayMode, setFilter, resetFilters } = salesDashboardSlice.actions
export default salesDashboardSlice.reducer
