
// -------------
// --- MySQL ---
// -------------

// importar libreria
const express = require("express");
const mysql = require("mysql");

// configuración para conectar con: base de datos y usuario
let conexion = mysql.createConnection({
    host: "localhost",
    database: "proyecto2",
    user: "diego",
    password: "1928",
    port: "3306"
})

// establecer conexión con base de datos mysql
conexion.connect(err => {
    if(err){
        throw err;
    }else{
        console.log("¡conexion establecida con base de datos en puerto 3306!");
    }
});

function select_all(tabla) {
    // petición de selección general en tabla
    const select = "SELECT * FROM " + tabla;
    conexion.query(select, (err, rows) => {
        if(err){
            throw err;
        }else{
            console.log("Consulta realizada correctamente");
            console.log(rows);
            // console.log(rows.length);
            // console.log(rows[0]);
            // console.log(rows[0].modelo);
        }
    })
}

function find_car(tabla, matricula) {
    // petición para comprobar si el coche ya existe en la base de datos
    const select = "SELECT * FROM " + tabla + " WHERE matricula = " + matricula;
    conexion.query(select, (err, rows) => {
        if(err){
            throw err;
        }else{
            if(rows.length > 0){
                console.log("No se puede añadir el coche, ya está registrada la matricula!");
                return true;
            }else{
                console.log("Matricula no registra, se procede...");
                return false;
            }
        }
    })
}

function insert_car(tabla, marca, modelo, matricula) {
    // petición de inserción en tabla
    // if(!find_car(tabla,matricula)){
        const insert = "INSERT INTO " + tabla + " (id, marca, modelo, matricula) VALUES (NULL, '" + marca + "', '" + modelo + "', '" + matricula + "')";
        conexion.query(insert, (err, rows) => {
            if(err){
                throw err;
            }else{
                console.log("Datos insertados correctamente");
                // console.log(rows);
            }
        })
    // }
}

function break_mysql(){
    // finalizar conexión mysql
    conexion.end();
}

select_all('coches');
// insert_car('coches', 'audi', 'a3', '1234BCD');
// select_all('coches');

// ---------------
// --- EXPRESS ---
// ---------------

// objeto para realizar llamadas de los métodos de express
const app = express();

// carpeta publica para recursos estáticos
app.use(express.static("public"));

// configuración para el motor de vistas
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// renderiza la vista solicitada de la carpeta 'views'
app.get("/", (req,res)=>{
    res.render("index");
})

app.post("/validar", (req,res)=>{
    const datos = req.body;
    console.log(req.body);
    console.log(datos.marca);
    console.log(datos.modelo);
    console.log(datos.matricula);
    let marca = datos.marca;
    let modelo = datos.modelo;
    let matricula = datos.matricula;

    insert_car('coches', marca, modelo, matricula);
})

// configuración del puerto para el servidor local
app.listen(5050, () => {
    console.log("El servidor iniciado en http://localhost:5050");
});
