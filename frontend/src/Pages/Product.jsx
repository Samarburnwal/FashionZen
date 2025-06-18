import React, { useContext } from 'react';
import { ShopContext } from '../Contexts/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const {all_products} = useContext(ShopContext);
  const {productId} = useParams(); //useParams is used to fetch the url data (/:productId ==> useParams() = productId);
  const product = all_products.find((e)=> e.id === Number(productId));
  
  
  return (
    <div className='product'>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product;