import { configureStore } from '@reduxjs/toolkit'
import recordsReducer from './recordsSlice'
import quickSerchReducer from './quickSerchSlice'

export default configureStore({
  reducer: {
    records: recordsReducer,
    quickSerch: quickSerchReducer,
  },
})