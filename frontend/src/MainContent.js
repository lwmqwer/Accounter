import React from 'react'
import './MainContent.css';
import { Table } from "./Table/index.tsx";


function MainContent() {
    return (
        <div className='main'>
            <Table />
        </div>
    )
}

export default MainContent


/*

function Records() {
    const [data, setData] = useState([]);
    

    useEffect(() => {
    fetchData();
    }, []
    );

    const fetchData = () => {
    fetch(URL_records)
        .then((res) => res.json())
        .then((response) => {setData(response)});
    };

    return (
    <table>
        <thead>
            <tr>
                <th>日期</th>
                <th>数量</th>
                <th>账本</th>
                <th>开销人</th>
                <th>大类</th>
                <th>子类</th>
                <th>明细</th>
            </tr>
        </thead>
        <tbody>
        {data.map((item) => (
            <tr key={item.ID}>
            <td>{item.date.split('T')[0]}</td>
            <td>{parseFloat(item.number)/100}</td>
            <td>{item.account}</td>
            <td>{item.person}</td>
            <td>{item.cate1}</td>
            <td>{item.cate2}</td>
            <td>{item.detail}</td>
            </tr>
        ))}
        </tbody>
    </table>
    );
}
*/