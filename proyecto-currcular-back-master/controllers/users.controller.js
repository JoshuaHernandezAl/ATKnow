const {response}=require('express');
const path=require('path');
const fs=require('fs');
const User = require('../models/User');
const Vacancie = require('../models/Vacancie');
const bcrypt = require("bcrypt");
const { generarJWT } = require('../helpers/generar-jwt');
const sendEmail = require('../handlers/email');
const shortid = require('shortid');


const getUsers=async(req,res=response,next)=>{
    const {limit=10,from=0}=req.query;
    try{
        const users= await User.find({state:true}).skip(Number(from)).limit(Number(limit)).sort({createdAt:-1});
        const usersReturn=users.map(user=>{
            const {role,premium,_id,name,email}=user
            const uid=_id;
            return {role,premium,uid,name,email};
        });
        return res.status(200).json({
            ok:true,
            msg:'Usuarios',
            users:usersReturn,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const getUser=async(req,res=response,next)=>{
    const {id}=req.params;
    try{
        const user= await User.findById(id);
        if(!user){
            return res.status(400).json({
                ok:false,
                msg:"Usuario no encontrado",
            })
        }
        if(!user.state){
            return res.status(400).json({
                ok:false,
                msg:"Usuario no encontrado",
            })
        }
        return res.status(200).json({
            ok:true,
            user,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:'Error, contactate con el administrador',
        });
    }
    
}
const createUser=async(req,res=response,next)=>{
    const {name,email,password,role}=req.body;
    try{
        const prevRegister=await User.findOne({email});
        if(!prevRegister){
            const user= new User({name,email:email.toLowerCase(),password,role});
            const token= await generarJWT(user.id);

            user.token=token;
            await user.save();
        
            //TODO: Actualiza url para produccion
            const activeUrl=`http://localhost:3000/restricted/active-account/${user.token}`;
            
            await sendEmail.send({
                user,
                subject:'Activar cuenta',
                activeUrl,
                archive:'activeAccount',
            });
            
            return res.status(200).json({
                ok:true,
                token,
                msg:"Usuario registrado correctamente,revisa tu bandeja de entrada para activar tu cuenta",
                user,
            });
        }else{
            return res.status(400).json({ok:false,msg:"El usuario ya esta registrado"});
        }
        
    }catch(err){
        console.log(err);
        return res.status(400).json({
            ok:false,
            msg:"Error en el servidor, contacte con un administrador",
        });
    }
}
const updateUser=async(req,res=response,next)=>{
    const {id}=req.params;
    const {name,email,password}=req.body;
    try{
        const user= await User.findById(id);
        // console.log(user);
        if(!user){
            return res.status(400).json({
                ok:false,
                msg:"Usuario no encontrado",
            })
        }
        if(password){
            if(password.length>=6){
                const hash=await bcrypt.hash(password,12);
                user.password=hash;
            }else{
                return res.status(400).json({
                    ok:false,
                    msg:"La contraseña debe de ser de almenos 6 caracteres",
                })
            }
        }
        if(req.file){
            if(req.file.mimetype==='image/jpeg' || req.file.mimetype==='image/png' || req.file.mimetype==='image/jpg'){
                if(user.image){
                    const pathImage=path.join(__dirname,'../public/uploads/profiles',user.image);
                    if(fs.existsSync(pathImage)){
                        fs.unlinkSync(pathImage);
                    }
                }
                user.image=req.file.filename;
            }else{
                const pathImage=path.join(__dirname,'../public/uploads/cv',req.file.filename);
                    if(fs.existsSync(pathImage)){
                        fs.unlinkSync(pathImage);
                    }
                return res.status(400).json({
                    ok:false,
                    msg:"Archivo invalido, solo jpeg,png,jpg",
                })
            }
        }
        user.name=name;
        user.email=email;
        await user.save();
        return res.status(200).json({
            ok:true,
            user,
            msg:'Usuario actualizado'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al actualizar el usuario",
        })
    }
}
const deleteUser=async(req,res=response,next)=>{
    const {id}=req.params;
    try{
        const user=await User.findByIdAndUpdate(id,{state:false},{new:true});
        if(!user){
            return res.status(400).json({
                ok:false,
                msg:"Usuario no encontrado",
            })
        }
        if(req.userAuth.role==='ADMIN_ROLE'){
            await Promise.all([
                Vacancie.updateMany({author:id},{available:false,state:false}),
                sendEmail.send({
                    user,
                    subject:'Cuenta de ATKnow Jobs eliminada',
                    archive:'AdminDeleteUserReported',
                })
            ]);
        }else{
            await Vacancie.updateMany({author:id},{available:false,state:false});
        }
        return res.status(200).json({
            ok:true,
            msg:"usuario eliminado",
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al eliminar el usuario",
        })
    }
}

const ssRequest=async(req,res=response,next)=>{
    const {id}=req.params;
    try{
        const user=await User.findByIdAndUpdate(id,{ssRequest:true,ssIdRequest:shortid.generate()},{new:true});
        await sendEmail.send({
            user,
            subject:'Solicitud de ATKnow Academico',
            idRequest:user.ssIdRequest,
            archive:'ATKnowAcademico',
        });
        return res.status(200).json({
            ok:true,
            msg:'Solicitud para validación enviada',
            msgDetail:`Se te envío un correo con los detalles. Tu número de solicitud es: ${user.ssIdRequest}`,
            ssRequest:user.ssRequest,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al realizar la solitud a ATKnow Académico, intentelo más tarde",
        })
    }
}

const getSSRequest=async(req,res=response,next)=>{
    const {limit=10,from=0}=req.query;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const users= await User.find({state:true,ssRequest:true},{ssIdRequest:1,email:1,name:1,ssChecked:1,ssRequest:1}).skip(Number(from)).limit(Number(limit)).sort({premium:-1,createdAt:-1});
        return res.status(200).json({
            ok:true,
            users,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const findSSRequest=async(req,res=response,next)=>{
    const {ssIdRequest}=req.params;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const users= await User.find({state:true,ssIdRequest},{ssIdRequest:1,email:1,name:1,ssChecked:1,ssRequest:1});
        if(!users){
            return res.status(200).json({
                ok:false,
                msg:"No hay una solicitud con ese identificador."
            });
        }
        return res.status(200).json({
            ok:true,
            users,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}

//!Este enpoint es de simulacion
const ssChecking=async(req,res=response,next)=>{
    const {idRequest}=req.body;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const user= await User.findOne({ssIdRequest:idRequest});
        if(!user){
            return res.status(400).json({
                msg:'No se encontro la petición',
            });
        }
        
        if(!user.state){
            return res.status(400).json({
                msg:'El usuario ha eliminado su cuenta o ha sido eliminado por otro administrador',
            });
        }
        user.ssChecked=true;
        await user.save();
        await sendEmail.send({
            user,
            subject:'Revision de solicitud en progreso',
            idRequest,
            archive:'ATKnowAcademicoChecking',
        });
        return res.status(200).json({
            ok:true,
            msg:'Tu solitud esta siendo revisada, pronto recibiras confirmación sobre si has sido o no autorizado para ser parte del ATKnow Académico'
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Algo ha salido mal, contacte con el administrador",
        })
    }
}

const ssConfirm=async(req,res=response,next)=>{
    const {idRequest}=req.body;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const user= await User.findOne({ssIdRequest:idRequest});
        if(!user){
            return res.status(400).json({
                msg:'No se encontro la petición',
            });
        }
        
        if(!user.state){
            return res.status(400).json({
                msg:'El usuario ha eliminado su cuenta o ha sido eliminado por otro administrador',
            });
        }
        user.ssRequest=false;
        user.ssChecked=false;
        user.role='SS_ROLE';
        await user.save();
        await sendEmail.send({
            user,
            subject:'Autorizacion de ATKnow Académico',
            idRequest,
            archive:'ATKnowAcademicoConfirm',
        });
        return res.status(200).json({
            ok:true,
            msg:'Tu has sido aprobada. Bienvenido a ATKnow Académico'
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Algo ha salido mal, contacte con el administrador",
        })
    }
}

const ssReject=async(req,res=response,next)=>{
    const {idRequest}=req.body;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const user= await User.findOne({ssIdRequest:idRequest});
        if(!user){
            return res.status(400).json({
                msg:'No se encontro la petición',
            });
        }
        
        if(!user.state){
            return res.status(400).json({
                msg:'El usuario ha eliminado su cuenta o ha sido eliminado por otro administrador',
            });
        }
        user.ssRequest=false;
        user.ssChecked=false;
        await user.save();
        await sendEmail.send({
            user,
            subject:'Rechazo de solitud a ATKnow Académico',
            idRequest,
            archive:'ATKnowAcademicoDecline',
        });
        return res.status(200).json({
            ok:true,
            msg:'Solitud rechazada. ATKnow te desea suerte en tu proxima solicitud'
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Algo ha salido mal, contacte con el administrador",
        })
    }
}

module.exports={
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    ssRequest,
    getSSRequest,
    ssChecking,
    ssConfirm,
    ssReject,
    findSSRequest
}