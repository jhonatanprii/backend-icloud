const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT

});

db.connect((err)=>{

    if(err){
        console.log(err);
    }else{
        console.log("MySQL conectado");
    }

});

app.post("/login",(req,res)=>{

    const {correo,password} = req.body;

    const sql = `
        INSERT INTO usuarios(correo,password)
        VALUES(?,?)
    `;

    db.query(sql,[correo,password],(err,result)=>{

        if(err){
            console.log(err);
            res.send("Error");
        }else{
            res.send("Datos guardados");
        }

    });

});

app.listen(3000,()=>{
    console.log("Servidor corriendo");
});