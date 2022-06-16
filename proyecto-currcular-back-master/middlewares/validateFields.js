const { validationResult } = require('express-validator');
const User= require('../models/User');
const Vacancie = require('../models/Vacancie');

const validateFields=(req,res,next)=>{
    const err=validationResult(req);
    if(!err.isEmpty()){
        return res.status(400).json(err);
    }
    next();
}
const matchPassword=(confirmPassword,req)=>{
    if(confirmPassword){
        if(confirmPassword !== req.body.password){
            throw new Error('Las contraseñas no coinciden');
        }else{
            return true;
        }
    }else{
        throw new Error('Ingresa contraseña');
    }
}
const validateUser=async(req,res=response,next)=>{
    const {id} = req.params;
    try{
        const user=await User.findById(id);
        if(!user){
            return res.status(400).json({
                ok:false,
                msg:'Error, no tiene permisos para realizar esta acción',
            });
        }
        if(String(user._id)!==String(req.userAuth.uid)){
            return res.status(400).json({
                ok:false,
                msg:'No tiene permisos para realizar la acción',
            });
        }else{
            return next();
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error,contacte al administrador"
        })
    }
}
const validateAuthor=async(req,res=response,next)=>{
    const {url} = req.params;
    try{
        const vacancie=await Vacancie.findOne({url});
        if(!vacancie){
            return res.status(400).json({
                ok:false,
                msg:'Error, no tiene permisos para realizar esta acción',
            });
        }
        if(String(vacancie.author)!==String(req.userAuth.uid)){
            return res.status(400).json({
                msg:'No tiene permisos para realizar la acción',
            });
        }else{
            return next();
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error,contacte al administrador"
        })
    }
}
const validateAdmin=async(req,res=response,next)=>{
    const {id} = req.params;
    const user=await User.findById(id);
    if(!user){
        const {url}=req.params;
        const vacancie = await Vacancie.findOne({url});
        if(!vacancie || !vacancie.state){
            return res.status(400).json({
                msg:'No tiene permisos para realizar la acción 83',
            });
        }
        if(req.userAuth.role!=='ADMIN_ROLE'){
            if(String(vacancie.author)!==String(req.userAuth.uid)){
                return res.status(400).json({
                    msg:'No tiene permisos para realizar la acción 89',
                });
            }else{
                return next();
            }
        }else{
            return next();
        }
    }else{
        if(req.userAuth.role!=='ADMIN_ROLE'){
            if(String(user._id)!==String(req.userAuth.uid)){
                return res.status(400).json({
                    msg:'No tiene permisos para realizar la acción 101',
                });
            }else{
                return next();
            }
        }else{
            return next();
        }
    }
}
module.exports ={
    validateFields,
    matchPassword,
    validateAuthor,
    validateAdmin,
    validateUser
}