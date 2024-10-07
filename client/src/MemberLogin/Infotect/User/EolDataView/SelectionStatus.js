import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as API from "./../../../../Endpoint/endpoint";

const SelectionStatus = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    getData();
  })

  const getData = () => {
    axios({
      url:(API.ADD_SELECTIONSTATUS_API),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      setData(res.data);
    }).catch((err) => {
      alert("failed")
    })
  }
  const SelectData = () => {
    axios({
      url: (API.ADD_SELECTIONSTATUS_API),
      method: 'GET',
      contentType: 'application/json',
    }).then((res) => {
      setData(res.data);
    }).catch((err) => {
      alert("failed")
    })
  }
  return (
    <>
      {data.map((d, k) => (
        <div key={k}>
          <h1>{d.id}</h1>
        </div>
      ))}
    </>
  )
}

export default SelectionStatus
