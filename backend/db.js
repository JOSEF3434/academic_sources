const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/academic_sources"

mongoose.connect(uri)
.then(() => {
  console.log("MongoDB connected successfully");
  console.log("Connected to database:", mongoose.connection.name);
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    code: err.code
  });
});
