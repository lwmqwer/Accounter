import './Sidebar.css';
import React from 'react'
import { useState }  from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreatableSelect from 'react-select/creatable';

import { selectAccounts, selectPersons, selectCate1, selectCate2, 
  addNewRecord, selectSumByAccount, selectSum} from './store/recordsSlice'

function Dateinput() {
  const [date, setDate] = useState(new Date());
  
  function before() {
    date.setDate(date.getDate()-1)
    setDate(new Date(date))
  }

  function after() {
    date.setDate(date.getDate()+1)
    setDate(new Date(date))
  }

  function hanlechange(e) {
    setDate(new Date(e.target.value))
  }
  
  return (
    <label>
    日期: <button type='button' onClick={before}> 前一天 </button> 
    <input type="date" name="date" value={date.toISOString().split('T')[0]} onChange={hanlechange} required/> 
    <button type='button' onClick={after}> 后一天 </button>
    </label>
  )
}

function NumberInput() {
  return (
    <label>
    金额: <input type="number" name="number" defaultValue="0.00" step="0.01" />
    </label>
  )
}

function AccountSelect() {
  const accounts = useSelector(selectAccounts)
  const options = accounts.map(account => ({label: account, value: account}))

  return (
    <label>
    账本:
    <CreatableSelect name="account" defaultValue={options[0]} options={options} required/>
    </label>
  )
}

function PersonSelect() {
  const persons = useSelector(selectPersons)
  const options = persons.map(person => ({label: person, value: person}))


  return (
    <label>
    主开销人:
    <CreatableSelect name="person" defaultValue={options[0]} options={options} required/>
    </label>
  )
}

function SubcateSelect({cate1}) {
  const cate2 = useSelector((state) => selectCate2(state, cate1))
  const options = cate2.map(cate => ({label: cate, value: cate}))

  return (
    <CreatableSelect name="cate2" defaultValue={options[0]} options={options} required/>
  )
}

function CategoriesSelect() {
  const cate1 = useSelector(selectCate1)
  const options = cate1.map(cate => ({label: cate, value: cate}))
  const [value, setvalue] = useState('');

  return (
    <>
    <label>
    大类:
    <CreatableSelect name="cate1" onChange={e=> setvalue(e.value)}  defaultValue={options[0]} options={options} required/>
    </label>
    <label>
    子类: <SubcateSelect cate1={value}/>
    </label>
    </>
  )
}

function Input() {
  const [canSave, setCanSave] = useState(true)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
      // Prevent the browser from reloading the page
      e.preventDefault();
  
      if (canSave) {
        try {
          setCanSave(false)
          // Read the form data
          const form = e.target;
          const formData = new FormData(form);
          const formJson = Object.fromEntries(formData.entries());
          formJson.date = formJson.date + 'T00:00:00Z'
          formJson.number=Math.round(formJson.number*100)
          await dispatch(addNewRecord(formJson)).unwrap()
        } catch (err) {
          console.error('Failed to save the post: ', err)
        } finally {
          setCanSave(true)
        }
    }}
    
    return (
      <form method='post' onSubmit={handleSubmit}>
        <Dateinput />
        <hr />
        <NumberInput />
        <hr />
        <AccountSelect/>
        <hr />
        <PersonSelect/>
        <hr />
        <CategoriesSelect/>
        <hr />
        <label>
          明细: <input name="detail" />
        </label>
        <hr />
        <button type="submit" disabled={!canSave}>增加</button>
      </form>
    );
}

function AccountStatus({account}) {
  const number = useSelector((state) => selectSumByAccount(state, account))
  return (
      <p className={account}>
        {account}: {number}
      </p>
  )
}

function Status() {
  const accounts = useSelector(selectAccounts)
  const sum = useSelector(selectSum)


  return (
      <div className='status'>
          {accounts.map((account => {return <div key={account}><AccountStatus account={account}/></div>})) }
          <p>总额: {sum} </p>
      </div>
  )
}

function Sidebar() {
    return (
        <div className='Sidebar'>
            <Input />
            <Status />
        </div>
    )
}

export default Sidebar