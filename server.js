const express = require('express');
const mysql2 = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = './uploads';
if(!fs.statSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static('uploads'));

const connection = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"gitdb"
});

const storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({storage:storage})
app.post('/insert',(req,res)=>{
    const {firstname,lastname,email} = req.body;
    const imagepath = req.file ? req.path : null;

    const sql = "INSERT INTO git(firstname,lastname,email,imagepath)";
    connection.query(sql,[firstname,lastname,email,imagepath](err,result));
    if(err) return res.status(500).json({error:err.message});
    res.json({message:"success",image:imagepath})
});
app.get('/get',(req,res)=>{
    const sql = "SELECT * FROM git";
    connection.query(sql,(err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        res.json(result)
    })
})
app.listen(5000, ()=>console.log(`server is on http://localhost:5000`));
