import mongoose from "mongoose";

const userSchema=mongoose.Schema({
   name:'',
   email:"",
   savedRecipes:[],
   password:"",
});

export const User=mongoose.model('User',userSchema);
