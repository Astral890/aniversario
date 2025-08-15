import ex from "express";
import cors from "cors";
import path from "path";
import db from "mysql2";
import ExcelJS from "exceljs"
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
server.post("/actualizarDia", mdb.actualizarDia);
server.post("/actualizarNoche", mdb.actualizarNoche);
server.get('/exportar', async (req, res) => {
  try {
    const query = `SELECT numero_empleado, nombre, asistencia_noche, asistencia_dia FROM invitados`;

    conn.query(query, async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al obtener los datos");
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Asistencias');

      worksheet.columns = [
        { header: 'N empleado', key: 'numero', width: 30},
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Asistencia Día', key: 'asistencia_dia', width: 20 },
        { header: 'Asistencia Noche', key: 'asistencia_noche', width: 20 }
      ];

      data.forEach(row => {
          worksheet.addRow({
            numero: row.numero_empleado,
            nombre: row.nombre,
            asistencia_dia: row.asistencia_dia ? 'Sí' : 'No',
            asistencia_noche: row.asistencia_noche ? 'Sí' : 'No'
          });
      });

      res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
          'Content-Disposition',
          'attachment; filename=asistencias.xlsx'
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el archivo Excel");
  }
});

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

conn.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
  connection.release();
});