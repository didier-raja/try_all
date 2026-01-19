const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();

//middleware 
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
//connectiio

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"didier"
});
//chech if cionnection is done well now 
connection.connect((err)=>{
    if(err){
        console.log('error on connection')
        return;
    }
    console.log('connection is done well')
});
//end points
//post end point

app.post('/post',(req,res)=>{
    const {fname,address}= req.body;

    connection.query("INSERT INTO users (fname,address) VALUES (?,?)",
        [fname,address],
        (err,result) =>{
        if(err) return res.status(500).json({error:err.message})
            res.status(201).json(result);
    });
});
app.get('/get',(req,res)=>{
    connection.query("SELECT * FROM users",(err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        res.status(200).json({get:result});
    });
});
app.put('/update/:id',(req,res)=>{
    const {id} = req.params;
    const {fname,address}= req.body;

    connection.query("UPDATE users SET fname =?,address = ? WHERE id = ?",[fname,address,id],(err,result)=>{
             if(err) return res.status(500).json({error:err.message});
        res.status(200).json({message:"update is well done  now bruh",result});
    })
})
app.delete('/delete/:id',(req,res)=>{
    const {id} = req.params;
    connection.query("DELETE FROM users WHERE id = ? ",[id],(err,result)=>{
            if(err) return res.status(500).json({error:err.message});
        res.status(200).json({message:"delete is well done  now bruh",result});
    })
})
const PORT = 5000;
 app.listen(PORT, ()=>{
    console.log(`server in now running at http://localhost:${PORT}`)
 });
