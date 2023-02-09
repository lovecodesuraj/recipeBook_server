import {User}  from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signin = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email);
    try {
        const existingUser = await User.findOne({ email });
        // console.log(existingUser);
        if (!existingUser) return res.status(404).json({ message: "user not found." });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        // console.log(isPasswordCorrect);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials." });
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET, { expiresIn: "1h" });
        console.log(token)
        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}
export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    // console.log(email,password,confirmPassword,firstName,lastName);
    try {
        const existingUser = await User.findOne({ email });
        // console.log(existingUser);
        // console.log(existingUser);
        if (existingUser) return res.status(400).json({ message: "user alreday exists." });
        if (password != confirmPassword) return res.status(400).json({ message: "password do not match." });
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword);
        const result = await User.create({
            email,
            name: `${firstName} ${lastName}`,
            password: hashedPassword
        });
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ result: result, token });

    } catch (error) {
        res.status(400).json({ mesage: "something went wrong" });
    }

}



export const findUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
       const user=await User.findById(id);
       res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const saveRecipe=async(req,res)=>{
    const {id}=req.params;
    const recipe=req.body;
    
    // console.log(recipe);
    try {
        const user= await User.findById(id);
        if(user.savedRecipes.find(ele=>ele.label===recipe.label)) return res.json({message:"Already saved"});
        // const updatedUser={...user,savedRecipes:[...user.savedRecipes,recipe]};
        const recipes=[...user.savedRecipes,recipe];
        const response=await User.findOneAndUpdate({_id:id},{$set:{savedRecipes:recipes}},{new : true});
    //  console.log(response);

        res.json(response);
    } catch (error) {

res.status(400).json({message:"something went wrong."});    }
}


