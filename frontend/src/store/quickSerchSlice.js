import { createSlice } from '@reduxjs/toolkit'

const initialState =  {
  value: (state) => state.records.records
}

const quickSerchSlice = createSlice({
  name: 'quickSerch',
  initialState,
  reducers: {
    quickSerchSet(state, action) {
      state.value = action.payload.value
    },
    quickSerchReset(state, action) {
      state.value = (state) => state.records.records
    }
  },
})

export const { quickSerchSet, quickSerchReset } = quickSerchSlice.actions

export default quickSerchSlice.reducer