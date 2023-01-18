require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const fileUpload = require('express-fileupload');

//const {isAuthUser,isAuthAdmin} = require('./middlewares/auth');
mongoose.set("strictQuery", false);

const store = new session.MemoryStore();
/*
app.use(cors({
    origin: '*',
    credentials:true
}));
*/

app.use(cors({
    origin:'*',
    credentials:true
}));


const connectDB = require('./config/dbconfig');

const PORT = process.env.PORT || 3500;
const connection = connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload())

app.use(session({
    secret: process.env.DATABASE_SECRET,
    name:process.env.DATABASE_NAME,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*30
    },
    store
}));

app.use('/user',require('./routes/user'))
app.use('/deck',require('./routes/deck'))
app.use('/pdf',require('./routes/pdf'))

mongoose.connection.once('open',()=>{
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
