const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    login:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    familiarWords:{
        type:Array,
        default:[]
    }
});


module.exports = mongoose.model('users',userSchema);