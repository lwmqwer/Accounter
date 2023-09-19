import './App.css';
import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Sidebar from './Sidebar.js';
import QuickSearch from './QuickSearch';
import MainContent from './MainContent';

import { fetchRecords } from './store/recordsSlice'

function App() {
  const dispatch = useDispatch()
  const recordsStatus = useSelector(state => state.records.status)

  useEffect(() => {
    if (recordsStatus === 'idle') {
      dispatch(fetchRecords())
    }
  }, [recordsStatus, dispatch])

  return (
    <div className="wrapper">
      <QuickSearch />
      <MainContent />
      <Sidebar />
    </div>
  )
}

export default App;
