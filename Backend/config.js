const mongoose = require('mongoose');
require('dotenv').config();
const connect = mongoose.connect(process.env.MONGO_URI);

connect.then(()=>{
    console.log("Connected to MongoDB Atlas");
}).catch((err)=>{
    console.log(err);
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const collection = new mongoose.model("users", LoginSchema);
module.exports = collection;