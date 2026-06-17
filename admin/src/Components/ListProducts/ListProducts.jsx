import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import crossicon from '../../assets/cross_icon.png'

const URL = process.env.BackendURL;

const ListProducts = () => {

  const [allproducts,setAllproducts] = useState([]);

  const fetchInfo = async ()=>{
    await fetch(`${URL}/allproducts`).then((res)=>res.json()).then((data)=>{setAllproducts(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[]);

  const remove_product = async (id)=>{
    await fetch(`${URL}/removeproducts`,{
        method:'Post',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify({id:id})
        
    })
    await fetchInfo();
  }

  return (
    <div className='list-products'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
            return <><div key={index} className='listproduct-format-main listproduct-format'>
                <img className='listproduct-product-icon' src={product.image} alt="" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img onClick={()=>{remove_product(product.id)}} src={crossicon} alt="" className="listproduct-remove-icon" />
            </div>
            <hr />
            </>
        })}
      </div>
    </div>
  )
}

export default ListProducts;