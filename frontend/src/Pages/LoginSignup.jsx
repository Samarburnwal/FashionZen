    import React, { useState } from 'react';
    import './CSS/LoginSignup.css';

    const LoginSignup = () => {

    const [state,setState] = useState("Login");
    const [formData,setformData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const changeHandler = (e)=>{
        setformData({...formData,[e.target.name]:e.target.value});
    } 

    const login = async ()=>{
        console.log("Login Here",formData);
        let responseData;
        await fetch('http://localhost:4000/login',{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'Content-Type':'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response)=>response.json()).then((data)=>responseData=data);
        console.log(responseData);
        
        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token);
            window.location.replace("/");
        }else{
            alert(responseData.errors);
        }
    }
    
    const signup = async ()=>{
        console.log("Signup Here",formData);
        let responseData;
        await fetch('http://localhost:4000/signup',{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'Content-Type':'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response)=>response.json()).then((data)=>responseData=data);
        console.log(responseData);
        
        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token);
            window.location.replace("/");
        }else{
            alert(responseData.errors);
        }
    }  

    return (
        <div className='loginsignup'>
        <div className="loginsignup-container">
            <h1>{state}</h1>
            <div className="loginsignup-fields">
            {state === 'Sign Up'?<input name='username' type="text" value={formData.username} onChange={changeHandler} placeholder='Your Name'/>:<></>}
            <input type="email" name='email' placeholder='Email Address' value={formData.email} onChange={changeHandler}/>
            <input type="password" name='password' value={formData.password} onChange={changeHandler} placeholder='Password'/>
            </div>
            <button onClick={()=>{state === 'Login'?login():signup()}}>Continue</button>
            {state === 'Sign Up'?<p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login</span></p>:<p className="loginsignup-login">Create New Account. <span onClick={()=>{setState("Sign Up")}}>SignUp</span></p>}

            {state === 'Sign Up'?<div className="loginsignup-agree">
            <input type="checkbox" name='' id=''/>
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>:<></>}
        </div>
        </div>
    )
    }

    export default LoginSignup