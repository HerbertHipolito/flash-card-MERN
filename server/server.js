require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
//const {isAuthUser,isAuthAdmin} = require('./middlewares/auth');
mongoose.set("strictQuery", false);

const store = new session.MemoryStore();
/*
app.use(cors({
    origin: '*',
    credentials:true
}));
*/

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin',"*")
    res.header('Access-Control-Allow-Headers','*');
    cors();
    next()
})

const connectDB = require('./config/dbconfig');

const PORT = process.env.PORT || 3500;
const connection = connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.DATABASE_SECRET,
    name:process.env.DATABASE_NAME,
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*15
    },
    store
}));

app.use('/user',require('./routes/user'))
app.use('/deck',require('./routes/deck'))

mongoose.connection.once('open',()=>{
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
