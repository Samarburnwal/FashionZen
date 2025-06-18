import { createContext, useState } from "react";
// import all_products from '../Components/Assets/all_product';
import { useEffect } from "react";
import axios from "axios";


export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart = {};
    for (let i = 0; i < 300+1; i++) {
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props)=>{

    const [cartItems,setCartItems] = useState(getDefaultCart());
    const [all_products,setAll_Products] = useState([]);
    const [user,setUser] = useState(null);

    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Products(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token' : `${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setCartItems(data))
        }

        const fetchProfile = async ()=>{
            const token = localStorage.getItem("auth-token");
    
            if(!token) return;
    
            try{
                const res = await axios.get('http://localhost:4000/fetchUser',{
                    headers:{
                        'auth-token':token,
                    },
                });
                setUser(res.data);
            }catch(err){
                console.error("Error fetching profile : ",err);
            }
        };
        fetchProfile();
    },[]);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    console.log(cartItems);

    const addToCart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
            
        }
    }

    const removeFromCart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const getTotalCartItems = ()=>{
        let totaltItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totaltItem += cartItems[item];
            }
        }

        return totaltItem;
    }

    const getTotalAmount = ()=>{
        let totaltAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_products.find((product)=>product.id === Number(item));
                totaltAmount += itemInfo.new_price * cartItems[item];
            }
        }

        return totaltAmount;
    }

    const getUser = ()=>{
        return user;
    }

    const getCart = ()=>{
        return cartItems;
    }

    const getProductRequest = async (id)=>{
        try {
            const productDetails = await axios.post('http://localhost:4000/get-product-requests',{id});
            //console.log(productDetails.data.product);
            
            return productDetails.data.product;

        } catch (error) {
            console.error("Error fetching product requests:", error);
        }
    }

    console.log(all_products);
    

    const contextValue = {all_products,getTotalAmount,getTotalCartItems,cartItems,addToCart,removeFromCart,getUser,getCart,getProductRequest};
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;