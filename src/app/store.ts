import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import salesDashboardReducer from '../features/salesDashboard/salesDashboardSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        salesDashboard: salesDashboardReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
