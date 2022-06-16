const {response} = require('express');
const jwt= require('jsonwebtoken');
const User= require('../models/User');
const validateJWT=async(req,res=response,next)=>{
    const token=req.header('x-token');//el argumento es el nombre de como se debe de enviar desde el front

    //validacion de token
    if(!token){
        return res.status(401).json({
            msg:'No hay token en la petición',
        });
    }
    try{
        let {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);//verifica que el JWT sea un JWT valido firmado por mi backend, y regresa todo el payload del token
        const userAuth=await User.findById(uid).populate('vacancies');

        if(!userAuth){
            return res.status(401).json({
                msg:'El usuario no existe',
            });
        }
        
        //verificar si el uid tiene estado en true
        if(!userAuth.state){
            return res.status(401).json({
                msg:'Token no válido',
            });
        }
        uid=userAuth._id;
        const {role,state,google,premium,name,email,vacancies,image,ssRequest}=userAuth;
        const userAuthR={
            role,
            state,
            google,
            premium,
            name,
            email,
            uid,
            vacancies,
            image,
            ssRequest,
        }
        req.userAuth=userAuthR;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            msg:'Token no válido',
        });
    }
}

module.exports={
    validateJWT,
}