import React, { useState } from 'react';
import './Addproducts.css';
import upload_image from '../../assets/upload_area.svg'

const BackendURL = process.env.BackendURL;

const AddProducts = () => {
    const [image,setImage] = useState(false);
    const imageHandler = (e)=>{
        setImage(e.target.files[0]);
    }

    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"",
        old_price:"",
        new_price:"",

    });

    const changeHandler = (e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value});
    }

    const AddProduct = async ()=>{
        //console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch(`${BackendURL}/upload`,{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp)=> resp.json()).then((data)=>{responseData=data});

        if(responseData.success){
            product.image = responseData.imageUrl;
            console.log(product);
            
            await fetch(`${BackendURL}/addproducts`,{
                method:"POST",
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed");
            })
        }

    }


  return (
    <div className='addproducts'>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={productDetails.name} type="text" name="name" placeholder="Type Holder" onChange={changeHandler}/>
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type Here'/>
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type Here'/>
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img
                src={image ? URL.createObjectURL(image) : upload_image}
                alt=""
                className='addproduct-thumbnail-img'
                />
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
        </div>
        <button onClick={()=>{AddProduct()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}

// const AddProduct = async () => {
//     if (!image) {
//         alert("Please upload an image");
//         return;
//     }

//     let formData = new FormData();
//     formData.append("product", image);

//     try {
//         // Upload image
//         const imageResponse = await fetch("http://localhost:4000/upload", {
//             method: "POST",
//             headers: { Accept: "application/json" },
//             body: formData,
//         });
//         const imageData = await imageResponse.json();

//         if (!imageData.success) {
//             alert("Image upload failed!");
//             return;
//         }

//         // Prepare product data
//         let product = { ...productDetails, image: imageData.imageUrl };

//         // Send product details to the backend
//         const productResponse = await fetch("http://localhost:4000/addproducts", {
//             method: "POST",
//             headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(product),
//         });

//         const productData = await productResponse.json();

//         if (productData.success) {
//             alert("Product Added Successfully!");
//             setProductDetails({
//                 name: "",
//                 image: "",
//                 category: "",
//                 old_price: "",
//                 new_price: "",
//             });
//             setImage(false);
//         } else {
//             alert("Failed to add product!");
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         alert("Something went wrong!");
//     }
// };


export default AddProducts