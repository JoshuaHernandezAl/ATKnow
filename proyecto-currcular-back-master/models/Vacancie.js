const { Schema, model } = require("mongoose");
const slug = require("slug");
const { v4: uuidv4 } = require('uuid');
const VacancieSchema = new Schema({
    title: {
        type: String,
        required: [true, "EL nombre de la vancante es obligatorio"],
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    location: {
        lat:String,
        lng:String,
        dir:String,
        state:String,
        city:String,
        country:String,
    },
    salary: {
        type: String,
        default: 0,
    },
    contract: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        lowercase: true,
    },
    skills: [String],
    candidates: [
        {
            name: String,
            email: String,
            cv: String,
            semester:String,
            institute:String,
        },
    ],
    candidatesNumber:{
        type:Number,
        default:0,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reports:[
        {
            email:String,
            reason:String,
        }
    ],
    reportsNumber:{
        type:Number,
        default:0,
    },
    reported:{
        type:Boolean,
        default:false,
    },
    available:{
        type:Boolean,
        default:true,
    },
    state:{
        type:Boolean,
        default:true,
    },
    experience:{
        type:Number,
        default:0,
    },
    socialService:{
        type:Boolean,
        default:false,
    },
    profesionalPractice:{
        type:Boolean,
        default:false,
    },
    premium:{
        type:Boolean,
        default:false,
    }
},{ timestamps: true });
VacancieSchema.pre("save", function (next) {
    if(!this.isModified('url')){
        return next();
    }
    const url = slug(this.title);
    this.url = `${url}-${uuidv4()}`;
    next();
});
//Indice para el buscador
// VacancieSchema.index({ titulo: "text" });

module.exports = model("Vacancie", VacancieSchema);
