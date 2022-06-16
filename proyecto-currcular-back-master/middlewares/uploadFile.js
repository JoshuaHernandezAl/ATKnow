const multer = require('multer');
const shortid = require('shortid');
const mimes=['image/jpeg', 'image/png', 'image/jpg','application/pdf'];
const uploadFile=(req,res=response,next)=>{
    upload(req,res,(error)=>{
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code==='LIMIT_FILE_SIZE'){
                    return res.status(400).json({
                        ok:false,
                        msg:'El archivo es muy grande: Máximo 2MB'
                    });
                }else{
                    console.log(error);
                    return res.status(400).json({
                        ok:false,
                        msg:error.message,
                    });
                }
                
            }else{
                return res.status(400).json({
                    ok:false,
                    msg:error.message,
                });
            }
        }else{
            return next();
        }
    });
}

const configMulter={
    limits:{fileSize:2000000},
    storage:fileStorage=multer.diskStorage({
        destination:(req,file,callback)=>{
            if(file.mimetype=='application/pdf'){
                callback(null,__dirname+'../../public/uploads/cv');
            }else{
                callback(null,__dirname+'../../public/uploads/profiles');
            }
        },
        filename:(req,file,callback)=>{
            const extension=file.mimetype.split('/')[1];
            callback(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(mimes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error('Formato no valido'),false);
        }
    },
}
const upload=multer(configMulter).single('fileupload');
module.exports={
    uploadFile,
};