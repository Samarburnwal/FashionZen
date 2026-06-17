const port = process.env.PORT || 4000;
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require("path");
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.log("Redis error:", err));

const Order = require('./models/Orders');

// It imports the built-in Node.js path module.
// The path module provides utilities for working with file and directory paths.

const cors = require('cors');
const { log } = require('console');
const { type } = require('os');


app.use(express.json());

//Using the cors() our react app will get connect from backend
app.use(cors());

mongoose.connect("mongodb+srv://samarburnwal:samar@cluster0.rb0ec.mongodb.net/");

app.get('/',(req,res)=>{
    res.send("Express App is Running");
})



//Image storing Engine

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage:storage});

app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

//Creating upload endpoints for images

app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        imageUrl:`https://fashionzen-backend.onrender.com/images/${req.file.filename}`
    });
});

//Schema for products

const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true
    }
})

app.post('/addproducts',async (req,res)=>{
    let products = await Product.find();
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }else{
        id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    });
    console.log(product);
    await product.save();
    await redis.del("popular_in_women");
    await redis.del("new_collections");
    console.log("Cache cleared after product update");
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name
    })
});

app.post('/removeproducts',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Remove");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for getting allproducts

app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("all products fetched");
    res.send(products);
})

// Schema creating for User Model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    cartData:{
        type:Object,
    },
    myOrders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Order',
        default:[]
    },

    date:{
        type:Date,
        default:Date.now
    }
})

// Creating Endpoint for registering User

app.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    
    if(check){
        return res.status(400).json({success:false,errors:"User already exists"})
    }

    let cart = {};

    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = new Users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// Creating endpoint for user login

app.post('/login',async (req,res)=>{
    let user =  await Users.findOne({email:req.body.email});

    if(user){
        let passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom',{expiresIn: '7d'});
            res.json({success:true,token});
        }else{
            res.json({success:false,errors:"Wrong Password"})
        }

    }else{
        res.json({success:false,errors:"Wrong email ID"})
    }
})


//creating middleware for user token

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"please authenticate"});
        }
    }
}

// endpoint for fetching the user

app.get('/fetchUser',fetchUser,async (req,res)=>{
    try{
        const userId = req.user.id;
        const user = await Users.findById(userId).select('-password');
        res.json(user);

    }catch(err){
        res.status(500).send('Internal Server Error');
    }
})
//creating endpoint for newcollection data

app.get('/newcollections', async (req, res) => {
  const CACHE_KEY = "new_collections";

  try {
    // Step 1: Check Redis first
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      console.log("New collections served from cache");
      return res.send(JSON.parse(cached));
    }

    // Step 2: Cache miss — fetch from MongoDB
    let products = await Product.find({});
    let newCollec = products.slice(1).slice(-8);

    // Step 3: Store in Redis for 5 minutes
    await redis.setex(CACHE_KEY, 300, JSON.stringify(newCollec));

    console.log("New collections fetched from DB and cached");
    res.send(newCollec);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// creating endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
  const CACHE_KEY = "popular_in_women";

  try {
    // Step 1: Check if data exists in Redis cache
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      console.log("Popular in women served from cache");
      return res.send(JSON.parse(cached));
    }

    // Step 2: Cache miss — fetch from MongoDB
    let products = await Product.find({ category: 'women' });
    let popular_in_women = products.slice(0, 4);

    // Step 3: Store in Redis for 5 minutes (300 seconds)
    await redis.setex(CACHE_KEY, 300, JSON.stringify(popular_in_women));

    console.log("Popular in women fetched from DB and cached");
    res.send(popular_in_women);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// creating endpoint for adding to cart

app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("added",typeof( req.body.itemId));
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    // console.log("Updated User:", userData.cartData[req.body.itemData]);
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ message: "Added" });
})

//creating endpoint for removing product from cartData

app.post('/removeproduct',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] > 0) userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ message: "removed" });
});

//creating endpoint to get cartData

app.post('/getCart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})



// creating endpoint for purchased items
app.post('/order-request',async (req,res)=>{
    try{
        const newOrder = new Order(req.body);
        await newOrder.save();
        
        await Users.findByIdAndUpdate(
            req.body.userId,
            { $push: { myOrders: newOrder._id } }
        );
        
        res.status(201).json({success:true, message: 'Order created successfully', order: newOrder });
        
    }catch(err){
        res.status(500).json({ message: 'Order creation failed', error: err.message });
    }
});


// product request fetching api

app.post('/get-product-requests', async (req, res) => {
    try {
      const {id} = req.body;
      const product = await Order.findById({ _id: id });
      res.json({ success: true, product });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching product requests", error: err.message });
    }
});

// api for fetching all product rrequests
app.get('/getAllOrders',async (req,res)=>{
    const Orders = await Order.find({});
    console.log("All Orders Fetched");
    res.send(Orders);
})

// api for updating order status

app.put('/:orderId/status', async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    res.json(order);
});
  
app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port "+port);
    }else{
        console.log("Error "+error);
    }
})