const {response}=require('express');
const Stripe = require('stripe');
const User= require('../models/User');
const schedule = require('node-schedule');
const sendEmail = require('../handlers/email');
const moment = require('moment');


const stripe= new Stripe(process.env.stripe_secret_key);

const endMembership= async(user,months)=>{
    user.premium=false;
    Promise.all([
        user.save(),
        sendEmail.send({
            user,
            subject:'Termino de membresia premium',
            months,
            archive:'endMembership',
        }),
    ]);
    // console.log(`Termino de membresia: ${user.premium}`);
}
const warningEndMembership= async(user,months)=>{
    await sendEmail.send({
        user,
        subject:'Tu membresia premium termina mañana',
        months,
        archive:'warningEndPremium',
    });
}

const scheduleExpirePayment=async(user,months)=>{
    //! Este seria para meses
    //* const addToWarningDate=(months*30)-1;
    //* let expireDate=moment().add(months,'months');
    //* let warningDate=moment().add(addToWarningDate,'days');
    
    const addToWarningDate=(months*60)-30;
    let expireDate=moment().add(months,'minutes');
    let warningDate=moment().add(addToWarningDate,'seconds');
    expireDate=expireDate.toDate();
    warningDate=warningDate.toDate();
    schedule.scheduleJob(warningDate, ()=>{
        warningEndMembership(user,months);
    });
    schedule.scheduleJob(expireDate, ()=>{
        endMembership(user,months);
    });
}

const payment=async(req,res=response,next)=>{
    const amountsAvailables={
        '1':500,
        '3':1300,
        '6':2200,
        '12':3800,
    }
    const {id,months,uid}=req.body;
    const amount=amountsAvailables[`${months}`];
    try{
        try{
            await stripe.paymentIntents.create({
                amount,
                currency: 'USD',
                description: "Suscripcion a ATKPremium",
                payment_method: id,
                confirm:true,
            })

            const user=await User.findById(uid);
            user.premium=true;
            scheduleExpirePayment(user,Number(months));
            // const expireDate= moment().add(Number(months),'months')
            // //TODO: Ajustar el codigo de prueba al definitivo
            // //!Estas linea solo son para prueba
            const expireDate= moment().add(Number(months),'minutes')
            // //!Aqui terminan la lineas de prueba
            user.expirePremium=expireDate;
            await Promise.all([
                user.save(),
                sendEmail.send({
                    user,
                    subject:'Miembro Premium',
                    months,
                    archive:'atknowPremium',
                }),
            ]);
            // console.log(`Inicio premium: ${user.premium}`);
            return res.status(200).json({
                ok:true,
                msg:'Pago existoso',
                premium:true,
            });
        }catch(err){
            return res.status(401).json({
                ok:false,
                msg:`Error, al realizar el pago.`,
                detail:err.raw?.message||'error',
            });
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            ok:false,
            msg:"Error contacte con el adminstrador",
        });
    }
}

module.exports={
    payment,
}