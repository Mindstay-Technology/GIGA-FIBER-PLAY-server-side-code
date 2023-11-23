import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js"
import  JWT from "jsonwebtoken";

//POST REGISTER
export const registerController = async(req,res) =>{
    try{
        const {name,email,password,phone,address,answer} = req.body;
        //validation
        if(!name){
            return res.send({error:'Name is Required'})
        }
        if(!email){
            return res.send({error:'Email is Required'})
        }
        if(!password){
            return res.send({error:'Password is Required'})
        }
        if(!phone){
            return res.send({error:'Phone is Required'})
        }
        if(!address){
            return res.send({error:'Address is Required'})
        }
        if(!answer){
            return res.send({error:'Answer is Required'})
        }

        //EXISTING USER
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success:true,
                message:"Already registered please login",
            });
        }
        
        //REGISTER USER
        const hashedPassword = await hashPassword(password)
        
        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()
        res.status(201).send({
            success:true,
            message:'User Registered Successfully',
            user
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
}


//POST LOGIN
export const loginController = async(req,res)=>{
    try {
        const {email,password}=req.body;
        //validation
        if(!email || !password){
            res.status(500).send({
                success:false,
                message:"Invalid email or password",
            })
        }

        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).send({
                success:false,
                message:'Email is not registered'
            })
        }
        
        //compare password
        const match = await comparePassword(password,user.password)
        if(!match){
            res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }

        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:'90s'});
        res.status(200).send({
            success:true,
            message:'Login Successfull',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token,
        });


    } catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
    }

} 



//Forgot password
export const forgotPasswordController = async (req,res)=>{
    try{
        const{email, answer, newPassword } = req.body;
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'Answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'New Password is required'})
        }
        //check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Answer"
            })
        }

        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:'Password reset successfully',
        })



    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            error
        })
    }
    

}

//test contoller
export const testController = (req,res)=>{
    try{
    res.send('Protected route');
    } catch(error){
        console.log(error);
        res.send({error})
    }
}; 

//UPDATE PROFILE
export const updateProfileController = async (req,res) =>{
    try {
        const {name,email,password,address,phone} = req.body      
        const user = await userModel.findById(req.user._id)
        //password
        if(password && password.length<6){
            return res.json({error:'Password is required and 6 character long'})
        }
        //password hashing
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user_id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
          //  email: email ||  user.email,
            address: address || user.address
        },{new:true})
        res.status(200).send({
            success:true,
            message:'Profile Updated  Successfully',
            updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while updating profile",
            error
        })
    }
}

