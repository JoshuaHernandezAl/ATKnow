const {response}=require('express');
const User = require('../models/User');
const Vacancie = require('../models/Vacancie');
const sendEmail = require('../handlers/email');

const getReportVacancies=async(req,res=response,next)=>{
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
        const vacanciesReported = await Vacancie.find({reported:true, state:true},{candidatesNumber:1,reports:1,reportsNumber:1,title:1,url:1}).skip(Number(from)).limit(Number(limit)).populate('author');
        return res.status(200).json({
            ok:true,
            vacanciesReported,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al acceder acceder a la base de datos"
        });
    }
}
const getReporVacancie=async(req,res=response,next)=>{
    const {id}=req.params;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const vacancieReported = await Vacancie.findById(id,{candidatesNumber:1,reports:1,reportsNumber:1,title:1,url:1}).populate('author');
        return res.status(200).json({
            ok:true,
            vacancieReported,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al acceder acceder a la base de datos"
        });
    }
}
const getReportUsers=async(req,res=response,next)=>{
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
        const usersReported = await User.find({reportedVacancies: {$gt: 2},state:true },{vacancies:0}).skip(Number(from)).limit(Number(limit));
        return res.status(200).json({
            ok:true,
            usersReported
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al acceder acceder a la base de datos"
        });
    }
}
const activeReportVacancie=async(req,res=response,next)=>{
    const {id}=req.params;
    const {uid:userId}=req.body;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const [userReported,vacancieUser] = await Promise.all([
            User.findById(userId,{reportedVacancies:1,email:1}).populate('reportedVacanciesRef'),
            Vacancie.findById(id,{reports:1,reportsNumber:1,title:1}),
        ]);
        userReported.reportedVacancies-=1;
        vacancieUser.reportsNumber=0;
        vacancieUser.reports=[];
        vacancieUser.available=true;
        vacancieUser.reported=false;
        const clearVancancieFromReportedVacanciesRef=userReported.reportedVacanciesRef.filter((vacancie) => (String(vacancie._id) !== String(vacancieUser._id)));
        userReported.reportedVacanciesRef=clearVancancieFromReportedVacanciesRef;
        await Promise.all([
            userReported.save(),
            vacancieUser.save(),
            sendEmail.send({
                user:userReported,
                subject:'Reactivacion de vacante',
                title:vacancieUser.title,
                archive:'AdminActiveVacancie',
            })
        ]);
        return res.status(200).json({
            ok:true,
            userReported,
            vacancieUser,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al acceder acceder a la base de datos"
        });
    }
}
const getReportUser=async(req,res=response,next)=>{
    const {id}=req.params;
    try{
        const {uid}=req.userAuth;
        const admin=await User.findById(uid);
        if(!admin || admin.role!=='ADMIN_ROLE'){
            return res.status(200).json({
                ok:false,
                msg:'No tiene permisos para realizar esta petición.',
            });
        }
        const [userReported,vacanciesUser] = await Promise.all([
            User.findById(id,{vacancies:0,reportedVacanciesRef:0}),
            Vacancie.find({author:id,available:false,reported:true,state:true},{candidatesNumber:1,reports:1,reportsNumber:1,title:1}),
        ]);
        return res.status(200).json({
            ok:true,
            userReported,
            vacanciesUser,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error al acceder acceder a la base de datos"
        });
    }
}
module.exports={
    getReportVacancies,
    getReportUsers,
    getReportUser,
    activeReportVacancie,
    getReporVacancie
}