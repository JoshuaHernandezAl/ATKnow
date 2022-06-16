const nodemailer=require('nodemailer');
const emailConfig = require('../config/emails');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');


let transport = nodemailer.createTransport({
    host:emailConfig.host,
    port:emailConfig.port,
    auth:{
        ...emailConfig.auth,
    }
});

//generar HTMLLinkElement
const generateHTML=(archive,options={})=>{
    const html=pug.renderFile(`${__dirname}/../views/emails/${archive}.pug`,options);
    return juice(html);
}

exports.send=async(options)=>{
    const html=generateHTML(options.archive,options);
    const text=htmlToText.htmlToText(html);
    let info = {
        from: 'All That We Know <no-reply-atknow>', // sender address
        to: options.user.email, // list of receivers
        subject: options.subject, // Subject line
        text, // plain text body
        html, // html body
    };
    const sendEmail= await transport.sendMail(info);
    return sendEmail;
}