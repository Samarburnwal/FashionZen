import React from 'react';;
import './Admin.css';
import Sidebar from '../Components/Sidebar/Sidebar';
import { BrowserRouter, Route ,Routes } from 'react-router-dom';
import AddProducts from '../Components/AddProducts/AddProducts';
import ListProducts from '../Components/ListProducts/ListProducts';
import OrderRequest from '../Components/OrderRequest/OrderRequest';

const Admin = () => {
  return (
    <div className='admin'>
      <BrowserRouter>
        <Sidebar/>
        <Routes>
          <Route path='/addproduct' element={<AddProducts/>}/>
          <Route path='/listproduct' element={<ListProducts/>}/>
          <Route path='/order-request' element={<OrderRequest/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Admin