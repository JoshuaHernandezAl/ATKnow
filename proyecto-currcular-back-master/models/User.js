const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema=new Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
    },
    name:{
        type: String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    token:String,
    image:String,
    role:{
        type:String,
        default:'USER_ROLE',
        required:true,
        enum:['ADMIN_ROLE','USER_ROLE','SS_ROLE'],
    },
    state:{
        type:Boolean,
        default:false,
    },
    premium:{
        type:Boolean,
        default:false,
    },
    expirePremium:Date,
    vacancies:[
        {
            type: Schema.Types.ObjectId,
            ref: "Vacancie",
        }
    ],
    totalCandidates:{
        type:Number,
        default:0,
    },
    ssRequest:{
        type:Boolean,
        default:false,
    },
    ssIdRequest:String,
    ssChecked:{
        type:Boolean,
        default:false,
    },
    reportedVacancies:{
        type:Number,
        default:0,
    },
    reportedVacanciesRef:[
        {
            type: Schema.Types.ObjectId,
            ref: "Vacancie",
        }
    ]
},
{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const hash=await bcrypt.hash(this.password,12);
    this.password=hash;
    next();
});
UserSchema.post('save',function(error,doc,next){
    if(error.name==='MongoError' && error.code===11000){
        next('Email ya está registrado');
    }else{
        next(error);
    }
});


UserSchema.methods={
    matchPassword:function(password){
        return bcrypt.compareSync(password,this.password);
    }
}
UserSchema.methods.toJSON=function(){
    const {__v,password,_id,...user}=this.toObject();
    user.uid=_id;
    return user;
}


module.exports = model("User",UserSchema);