const {response}=require('express');
const Vacancie = require('../models/Vacancie');
const User  = require('../models/User');
const slug = require("slug");
const path=require('path');
const fs=require('fs');
const sendEmail = require('../handlers/email');

const getVacancies=async(req,res=response,next)=>{
    const {limit=10,from=0}=req.query;
    try{
        const vacancies= await Vacancie.find({state:true,available: true}).skip(Number(from)).limit(Number(limit)).sort({createdAt:-1}).populate('author');
        const vacanciesAv=vacancies.filter(vancancie=>{
            return vancancie.author.state===true;
        });
        return res.status(200).json({
            ok:true,
            msg:'Vacantes',
            vacancies:vacanciesAv,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const getVacancie=async(req,res=response,next)=>{
    const {url}=req.params;
    try{
        const vacancie=await Vacancie.findOne({url,available:true}).populate('author');
        if(!vacancie){
            return res.status(400).json({
                ok:false,
                msg:"Error,vacante no encontrada",
            });
        }
        return res.status(200).json({
            ok:true,
            vacancie,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        })
    }

}
const createVacancie=async(req,res=response,next)=>{
    try{
        const {body}=req;
        data={...body,author:req.userAuth.uid};
        if(data.location.lat==='' || data.location.lng===''|| data.location.dir==='' || data.location.state==='' || data.location.city==='' || data.location.country===''){
            return res.status(401).json({
                ok:false,
                msg:"Error, seleccione una ubicacion válida"
            })
        }
        const url = slug(body.title);
        data.url=url;
        const vacancie=new Vacancie(data);
        //console.log(vacancie);
        const user = await User.findById(req.userAuth.uid);
        if(user.premium){
            vacancie.premium=true;
        }
        if(user.role!=='SS_ROLE' && (vacancie.socialService || vacancie.profesionalPractice)){
            return res.status(401).json({
                ok:false,
                msg:"No tiene permisos para crear una vacante de ese tipo"
            })
        }
        const newVacancie = await vacancie.save();

        user.vacancies=[...user.vacancies,newVacancie];
        await user.save();

        return res.status(200).json({
            ok:true,
            vacancie:newVacancie,
        }) 
    }catch(err){
        console.log(err);
    }
}
const updateVacancie=async(req,res=response,next)=>{
    const {url}=req.params;
    const body=req.body;
    try{
        const vacancie=await Vacancie.findOneAndUpdate({url,available:true},{...body},{new:true});
        if(!vacancie || !vacancie.state){
            res.status(404).json({
                ok:false,
                msg:"Error, vacante no encontrada",
            })
        }
        res.status(200).json({
            ok:true,
            vacancie,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"error,contacte con el administrador",
        })
    }
}
const deleteVacancie=async(req,res=response,next)=>{
    const {url}=req.params;
    try{
        const vacancie = await Vacancie.findOne({url,state:true});
        if(!vacancie){
            return res.status(200).json({
                ok:false,
                msg:"Vacante inexistente",
            })
        }
        
        if(req.userAuth.role==='ADMIN_ROLE'){
            const user=await User.findById(vacancie.author).populate('reportedVacanciesRef');
            const clearVancancieFromReportedVacanciesRef=user.reportedVacanciesRef.filter((vacancieReported) => (String(vacancie._id) !== String(vacancieReported._id)));
            user.reportedVacanciesRef=clearVancancieFromReportedVacanciesRef;
            user.reportedVacancies-=1;
            user.totalCandidates-=vacancie.candidatesNumber;
            await Promise.all([
                Vacancie.findOneAndUpdate({url},{state:false,available:false},{new:true}),
                user.save(),
                sendEmail.send({
                    user,
                    subject:'Vacante eliminada',
                    title:vacancie.title,
                    archive:'AdminDeleteVacancieReported',
                })
            ]);
        }else{
            await Vacancie.findOneAndUpdate({url},{state:false,available:false},{new:true});
        }
        return res.status(200).json({
            ok:true,
            msg:"Vacante eliminada",
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"error,contacte con el administrador",
        })
    }
}
const suspendVacancie=async(req,res=response,next)=>{
    const {url}=req.params;
    try{
        const vacancie=await Vacancie.findOneAndUpdate({url},{available:false},{new:true});
        res.status(200).json({
            ok:true,
            msg:"Vacante suspendida",
            vacancie,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"error,contacte con el administrador",
        })
    }
}
const activeVacancie=async(req,res=response,next)=>{
    const {url}=req.params;
    try{
        const vacancie=await Vacancie.findOne({url});
        //TODO: Cambiar el numero de reportes para prduccion
        if(vacancie.reports.length>2){
            return res.status(403).json({
                ok:false,
                msg:"Su vacante fue suspendida por varios reportes, en estos momentos se encuentra bajo revision."
            });
        }
        vacancie.available=true;
        vacancie.save();
        res.status(200).json({
            ok:true,
            msg:"Vacante activada",
            vacancie,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"error,contacte con el administrador",
        })
    }
}
const contact=async(req,res=response,next)=>{
    const {url}=req.params;
    const vacancie= await Vacancie.findOne({url,available:true});
    if(!vacancie){
        return res.status(400).json({
            ok:false,
            msg:"La vacante no existe",
        })
    }
    const {name,email,semester,institute}=req.body;
    
    const exist=vacancie.candidates.filter(candidate=>(
        candidate.email===email
    ));
    const author=await User.findById(vacancie.author);
    if(exist.length>0) {
        const pathImage=path.join(__dirname,'../public/uploads/cv',req.file.filename);
        if(fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
        return res.status(401).json({
            ok:false,
            msg:"Ya has enviado un mensaje ha esta vacante, espero tu respuesta"
        })
    }
    if(!req.file){
        return res.status(400).json({
            ok:false,
            msg:"Error, adjunta tú CV",
        });
    }else if(req.file.mimetype!=='application/pdf'){
        const pathImage=path.join(__dirname,'../public/uploads/profiles',req.file.filename);
        if(fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }
        return res.status(400).json({
            ok:false,
            msg:"Error, solo puede subir tu cv en PDF",
        });
    }
    let candidate={};
    if(semester || institute){
        candidate={
            name,
            email,
            semester,
            institute,
            cv:req.file.filename,
        }
    }else{
        candidate={
            name,
            email,
            cv:req.file.filename,
        }
    }
    vacancie.candidates=[...vacancie.candidates,candidate];
    vacancie.candidatesNumber+=1;
    author.totalCandidates+=1;
    await Promise.all([vacancie.save(),author.save()]);
    return res.status(200).json({
        ok:true,
        msg:"CV, enviado",
    });
}
const firstJob=async(req,res=response,next)=>{
    const {limit=10,from=0}=req.query;
    try{
        const vacancies= await Vacancie.find({state:true,available: true,experience:0,socialService:false,profesionalPractice:false}).skip(Number(from)).limit(Number(limit)).sort({createdAt:-1}).populate('author');
        const vacanciesAv=vacancies.filter(vancancie=>{
            return vancancie.author.state===true;
        });
        return res.status(200).json({
            ok:true,
            msg:'Vacantes',
            vacancies:vacanciesAv,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const socialService=async(req,res=response,next)=>{
    const {limit=10,from=0}=req.query;
    try{
        const vacancies= await Vacancie.find({state:true,available: true,socialService:true}).skip(Number(from)).limit(Number(limit)).sort({createdAt:-1}).populate('author');
        const vacanciesAv=vacancies.filter(vancancie=>{
            return vancancie.author.state===true;
        });
        return res.status(200).json({
            ok:true,
            msg:'Vacantes',
            vacancies:vacanciesAv,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const profesionalPratices=async(req,res=response,next)=>{
    const {limit=10,from=0}=req.query;
    try{
        const vacancies= await Vacancie.find({state:true,available: true,profesionalPractice:true}).skip(Number(from)).limit(Number(limit)).sort({createdAt:-1}).populate('author');
        const vacanciesAv=vacancies.filter(vancancie=>{
            return vancancie.author.state===true;
        });
        return res.status(200).json({
            ok:true,
            msg:'Vacantes',
            vacancies:vacanciesAv,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const randomVacanciePremium=async(req,res=response,next)=>{
    try{
        const vacancie= await Vacancie.aggregate([
            {$match:{premium:true,available:true}},
            {$sample:{size:1}}
        ]);
        return res.status(200).json({
            ok:true,
            msg:'Vacante Premium',
            vacancie
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const bestVacancies=async(req,res=response,next)=>{
    const {premium}=req.params;
    try{
        if(premium){
            const vacancies=await Vacancie.find({premium:true,socialService:false,available:true}).sort({candidatesNumber:-1}).limit(5).populate('author');
            return res.status(200).json({
                ok:true,
                vacancies,
            });
        }
        const vacancies=await Vacancie.find({premium:false,socialService:false,available:true}).sort({candidatesNumber:-1}).limit(5);
        return res.status(200).json({
            ok:true,
            vacancies,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }

}
const reportVacancie=async(req,res=response,next)=>{
    const {url}=req.params;
    const {email,reason}=req.body;
    try{
        const vacancie = await Vacancie.findOne({url});
        if(!vacancie){
            return res.status(400).json({
                ok:false,
                msg:"La vacante no existe",
            })
        }
        const report={
            email,
            reason
        }
        const exist=vacancie.reports.filter(report=>{ 
            return report.email===email;
        });
        if(exist.length>0){
            return res.status(400).json({
                ok:false,
                msg:"Ya reportaste esta vacante",
            }) 
        }
        
        vacancie.reports=[...vacancie.reports,report];        
        if(vacancie.reports.length>2){
            //TODO: Cambiar la cantidad de reportes para produccion
            vacancie.available=false;
            vacancie.reported=true;
            const author=await User.findById(vacancie.author);
            author.reportedVacancies+=1;
            author.reportedVacanciesRef=[...author.reportedVacanciesRef,vacancie];
            await Promise.all([
                sendEmail.send({
                    user:author,
                    subject:'Suspensión de vacante',
                    title:vacancie.title,
                    archive:'VacancieSuspension',
                }),
                author.save()
            ]);
        }
        vacancie.reportsNumber+=1;
        await vacancie.save();
        return res.status(200).json({
            ok:true,
            msg:"Vacante reportada, gracias por hacer que ATKnow sea mejor",
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const vacancieByUser=async(req,res=response,next)=>{
    const {id}=req.params;
    try{
        const vacancies=await Vacancie.find({author:id,state:true,reported:false}).sort({createdAt:-1});
        if(!vacancies){
            return res.status(401).json({
                ok: false,
                msg:"No existen vacantes",
            });
        }
        return res.status(200).json({
            ok:true,
            vacancies,
        })
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}
const bestVacancieByUser=async(req,res=response,next)=>{
    const {id}=req.params;
    try{
        const [vacancies,user]=await Promise.all([
            Vacancie.find({author:id,state:true,available:true},{candidatesNumber:1,_id:0,title:1,url:1}).sort({candidatesNumber:-1}).limit(3),
            User.findById(id,{totalCandidates:1,_id:0})
        ]);
        if(!vacancies){
            return res.status(401).json({
                ok: false,
                msg:"No existen vacantes",
            });
        }
        return res.status(200).json({
            ok:true,
            vacancies,
            user,
        })
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error, contacte al administrador",
        });
    }
}


module.exports={
    getVacancies,
    getVacancie,
    createVacancie,
    deleteVacancie,
    updateVacancie,
    contact,
    firstJob,
    socialService,
    profesionalPratices,
    randomVacanciePremium,
    bestVacancies,
    reportVacancie,
    vacancieByUser,
    suspendVacancie,
    activeVacancie,
    bestVacancieByUser,
}