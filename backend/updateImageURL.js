const mongoose = require("mongoose");

// 1. Connect to MongoDB Atlas
const uri = "your_atlas_connection_string"; // <-- replace with your Atlas URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// 2. Define your Product model (same as in your app)
const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  available: Boolean,
  date: String
});
const Product = mongoose.model("Product", ProductSchema, "products"); 
// 👆 "products" is your collection name (as in test.products)

// 3. Update function
async function updateImageURLs() {
  const oldBase = "http://localhost:4000";
  const newBase = "https://your-backend.com"; // <-- replace with your running backend link

  try {
    const result = await Product.updateMany(
      { image: { $regex: oldBase } },
      [
        {
          $set: {
            image: {
              $replaceOne: {
                input: "$image",
                find: oldBase,
                replacement: newBase
              }
            }
          }
        }
      ]
    );
    console.log("Update result:", result);
  } catch (err) {
    console.error("Error updating:", err);
  } finally {
    mongoose.disconnect();
  }
}

updateImageURLs();
