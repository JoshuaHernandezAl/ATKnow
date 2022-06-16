const {response}=require('express');
const Vacancie = require('../models/Vacancie');

const searchFast=async(req,res=response,next)=>{
    const {query}=req.params;
    if(!query){
        return res.status(200).json({
            ok:false,
            mag:"Error, es necesario que introduzca un parámetro a buscar.",
        });
    }
    const regex=new RegExp(query,'i');
    const {limit=10,from=0}=req.query;
    try{
        const vacancies=await Vacancie.find({
            $or:[{title:regex},{description:regex}],
            $and:[{state:true},{available:true}]
        }).skip(Number(from)).limit(Number(limit)).sort({premium:-1,createdAt:-1}).populate('author');;
        if(vacancies.length===0){
            return res.status(200).json({
                ok:true,
                msg:"Lo lamentamos, no tenemos registrado ninguna vacante que coincida",
            });
        }
        return res.status(200).json({
            ok:true,
            vacancies,
            count:vacancies.length,
        });
    }catch(err){
        console.log(err);
        return res.status(200).json({
            ok:false,
            mag:"Error, contacte un administrador",
        });
    }
}

const searchAdvanced=async(req,res=response,next)=>{
    const {state,city,title,experience=0}=req.body;
    const regexState=new RegExp(state,'i');
    const regexCity=new RegExp(city,'i');
    const regexTitle=new RegExp(title,'i');
    const {limit=10,from=0}=req.query;
    try{
        const vacancies=await Vacancie.find({
                $and:[
                    {
                        $or:[{title:regexTitle},{description:regexTitle},{"location.experience":experience},{"location.city":regexCity}],
                    },
                    {
                        $and:[{state:true},{available:true}]
                    },
                    {
                        $and:[{"location.state": regexState}]
                    }
                ]
            }).skip(Number(from)).limit(Number(limit)).sort({premium:-1,createdAt:-1}).populate('author');
            

        if(vacancies.length===0){
            return res.status(200).json({
                ok:true,
                msg:"Lo lamentamos, no tenemos registrado ninguna vacante que coincida",
            });
        }
        
        return res.status(200).json({
            ok:true,
            count:vacancies.length,
            vacancies,
        });
        
    }catch(err){
        console.log(err);
        return res.status(200).json({
            ok:false,
            mag:"Error, contacte un administrador",
        });
    }
}

module.exports={
    searchFast,
    searchAdvanced,
}