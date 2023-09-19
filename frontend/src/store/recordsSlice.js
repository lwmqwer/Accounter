import { createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit'

import { client } from './client'

const initialState = {
  records: [],
  status: 'idle',
  error: null,
}

export const fetchRecords = createAsyncThunk('records/fetchRecords', async () => {
  const response = await client.get()
  return response.data
})

export const addNewRecord = createAsyncThunk('records/addNewRecord', async (record) => {
    const response = await client.post(record)
    return response.data
})

export const updateRecord = createAsyncThunk('records/updateRecord', async (record) => {
  const response = await client.put(record)
  return response.data
})

export const deleteRecord = createAsyncThunk('records/deleteRecord', async (record) => {
  await client.delete('id='+record.ID)
  return record
})

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
    .addCase(fetchRecords.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchRecords.fulfilled, (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.records = action.payload
    })
    .addCase(fetchRecords.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
    .addCase(addNewRecord.fulfilled, (state, action) => {
      state.records.push(action.payload)
    })
    .addCase(deleteRecord.fulfilled, (state, action) => {
      state.records = state.records.filter((record) => record.ID !== action.payload.ID)
    })
  },
})

export const { recordsAdded } = recordsSlice.actions

export default recordsSlice.reducer

export const selectAllRecords = (state) => state.records.records

export const selectAccounts = (state) => [ ...new Set(state.records.records.map(record => record.account))]

export const selectPersons = (state) =>  [ ...new Set(state.records.records.map(({person}) => person))]

export const selectCate1 = (state) =>  [ ...new Set(state.records.records.map(({cate1}) => cate1))]

export const selectCate2 = (state, cate) =>  [ ...new Set(state.records.records.filter(({cate1}) => cate1 === cate).map(({cate2}) => cate2))]

export const selectSum = createSelector(
  [selectAllRecords],
  (records) => records.reduce((accumulator, record) => accumulator + record.number, 0)
)

export const selectSumByAccount = createSelector(
  [selectAllRecords, (state, account) => account],
  (records, account) => records.filter(record => record.account === account).reduce((accumulator, record) => accumulator + record.number, 0)
)

export const selectRecordsByAccount = createSelector(
  [selectAllRecords, (state, account) => account],
  (records, account) => records.filter(record => record.account === account)
)

export const selectRecordsByPerson = createSelector(
  [selectAllRecords, (state, person) => person],
  (records, person) => records.filter(record => record.person === person)
)

export const selectRecordsByCate1 = createSelector(
  [selectAllRecords, (state, cate1) => cate1],
  (records, cate1) => records.filter(record => record.cate1 === cate1)
)

export const selectRecordsByCate2 = createSelector(
  [selectAllRecords, (state, cate2) => cate2],
  (records, cate2) => records.filter(record => record.cate2 === cate2)
)