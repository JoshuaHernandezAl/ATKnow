
const {response}= require('express');
const jwt= require('jsonwebtoken');
const User= require('../models/User');
const { generarJWT } = require('../helpers/generar-jwt');
const sendEmail = require('../handlers/email');



const login=async(req,res=response)=>{
    const {email,password}=req.body;
    try{
        const user= await User.findOne({email}).populate('vacancies').populate({path: 'vacancies', options: { sort: { 'createdAt': -1 },limit:5 } })
        if(!user){
            return res.status(400).json({
                msg:'Credenciales incorrectas',
            });
        }
        
        if(!user.state){
            return res.status(400).json({
                msg:'Credenciales incorrectas',
            });
        }
        //verificar contraseña
        const validPass= user.matchPassword(password)
        if(!validPass){
            return res.status(400).json({
                msg:'Credenciales incorrectas',
            });
        }
        const date=new Date();
        if(date.getTime()>user.expirePremium?.getTime()){
            user.premium=false;
            await user.save();
        }

        const token= await generarJWT(user.id);
        return res.json({
            ok:true,
            token,
            user,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Algo ha salido mal, contacte con el administrador",
        })
    }

}
const renewToken=async(req,res=response,next)=>{
    const {uid}= req.userAuth;
    const token=await generarJWT(uid);

    return res.json({
        ok:true,
        msg:'revalidar token',
        token,
        userAuth:req.userAuth,
    });
}

const activeAccount=async(req,res=response,next)=>{
    try{
        const {token}= req.params;
        let {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);//verifica que el JWT sea un JWT valido firmado por mi backend, y regresa todo el payload del token
        const user= await User.findById(uid);
        if(!user || user.token!==token){
            return res.status(401).json({ok:false,msg:"Error, token no válido"});
        }
        user.state=true;
        user.token='';
        await user.save();
        const newToken= await generarJWT(user.id);
        return res.json({
            ok:true,
            token:newToken,
            user,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Algo ha salido mal, contacte con el administrador",
        });
    }
}
const resetPassword=async(req,res=response,next)=>{
    const {password,token}=req.body;
    try{
        let {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);//verifica que el JWT sea un JWT valido firmado por mi backend, y regresa todo el payload del token
        const user= await User.findById(uid);
        if(!user || user.token!==token){
            return res.status(401).json({ok:false,msg:"Error, token no válido"});
        }
        user.state=true;
        user.token='';
        user.password=password;
        await user.save();
        const newToken= await generarJWT(user.id);
        return res.json({
            ok:true,
            token:newToken,
            user,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Algo ha salido mal, contacte con el administrador",
        });
    }
}
const resetPasswordEmail=async(req,res=response,next)=>{
    const {email}=req.body;
    try{
        const user= await User.findOne({email});
        if(!user){
            return res.status(401).json({ok:false,msg:"Error, usuario inexistente"});
        }
        const newToken= await generarJWT(user.id);
        //TODO: cambiar ruta para prod
        const resetUrl=`http://localhost:3000/restricted/reset-password-confirm/${newToken}`;
        user.token=newToken;
        user.save();
        await sendEmail.send({
            user,
            subject:'Reestablecer Contraseña',
            resetUrl,
            archive:'resetPassword',
        });
        return res.json({
            ok:true,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Algo ha salido mal, contacte con el administrador",
        });
    }
}

module.exports={
    login,
    renewToken,
    activeAccount,
    resetPassword,
    resetPasswordEmail,
}