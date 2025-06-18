const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },

    fullName: {
        type: String,
        required: true,
      },
    
      email: {
        type: String,
        required: true,
      },
    
      address: {
        type: String,
        required: true,
      },
    
      city: {
        type: String,
        required: true,
      },
    
      state: {
        type: String,
        required: true,
      },
    
      zipCode: {
        type: String,
        required: true,
      },
    
      paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'upi'],
        required: true,
      },
    
      cardDetails: {
        cardNumber: String,
        expiryDate: String,
        cvv: String,
      },
    
      upiId: {
        type: String,
      },
    
      createdAt: {
        type: Date,
        default: Date.now,
      },

      status:{
        type:String,
        default:"Shipping in Process"
      },

      price:{
        type:Number,
        required:true
      },
      cartItems:{
        type:Array,
        required:true
      }
});

module.exports = mongoose.model('Order',orderSchema);