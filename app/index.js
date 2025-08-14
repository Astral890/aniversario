import ex from "express";
import cors from "cors";
import path from "path";
import db from "mysql2";
import { methods as mdb } from "./db_methods/db_methods.js";
import { fileURLToPath } from "url";

const server=ex();
server.use(cors());
server.use(ex.json());
const _dirname=path.dirname(fileURLToPath(import.meta.url));
server.use(ex.static(_dirname+"/public"));

server.set("port",4000);
server.listen(server.get("port"), "0.0.0.0", ()=>{
    console.log("Servidor corriendo en http://10.33.30.143:4000");
})

server.get("/",(req,res)=>res.sendFile(_dirname+"/pages/guests.html"));
server.get("/night",(req,res)=>res.sendFile(_dirname+"/pages/night.html"));
server.post("/registrarAsistenciaDia", mdb.asistenciaDia);
server.post("/registrarAsistenciaNoche", mdb.asistencaNoche);
server.post("/getEmployee", mdb.getEmployee);

export const conn=db.createPool({
host: "localhost",
user: "root",          // Remplazar con tu nombre de usuario
password: "admin",  // Remplazar con tu contraseña
database: "aniversario",
port: 3306,
waitForConnections: true,
connectionLimit: 10,
maxIdle: 10,
idleTimeout: 60000,
queueLimit: 0,
enableKeepAlive: true,
keepAliveInitialDelay: 500,
});

// Prueba de conexión a la base de datos
conn.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
  connection.release(); // Liberar la conexión de vuelta al pool
});