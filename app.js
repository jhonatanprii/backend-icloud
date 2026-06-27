const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err)=>{

    if(err){
        console.log(err);
    }else{
        console.log("MySQL conectado");
    }

});

app.post("/login", (req, res) => {

    try {
        const { correo, password } = req.body || {};

        if (!correo || !password) {
            return res.status(400).json({ ok: false, message: "Completa correo y contraseña." });
        }

        console.log("Nuevo inicio de sesión");
        console.log("Correo:", correo);

        const sql = `
            INSERT INTO usuarios(correo,password)
            VALUES(?,?)
        `;

        db.query(sql, [correo, password], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ ok: false, message: "Error al guardar los datos." });
            }
            return res.status(200).json({ ok: true, message: "Datos guardados correctamente." });
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ ok: false, message: "Error interno del servidor." });
    }
});

app.get("/usuarios", (req, res) => {

    const sql = "SELECT * FROM usuarios ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error al obtener usuarios"
            });
        }

        res.json(result);

    });

});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor corriendo");
});
