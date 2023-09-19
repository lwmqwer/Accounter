import './QuickSearch.css';
import React from 'react'
import { useDispatch } from 'react-redux'

import { quickSerchSet, quickSerchReset} from './store/quickSerchSlice'

function QuickSearch() {
    const dispatch = useDispatch()
    const filter = (para) => {return record => record.account === para}
    const setaccount = (e) => {
        const para = filter(e.currentTarget.name)
        dispatch(quickSerchSet({value: (state) => state.records.records.filter(para)}))
    }

    return (
        <div className='navigation'>
            <ul>
            <li><button onClick={setaccount} name='信用卡'>信用卡</button></li>
                <li><button onClick={setaccount} name='现金'>现金</button></li>
                <li><button onClick={() => (dispatch(quickSerchReset()))}>重置</button></li>
            </ul>
        </div>
    )
}
export default QuickSearch