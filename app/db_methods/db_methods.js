import { conn } from "../index.js";

function getEmployee(req,res){
    console.log(req.body);
    const { numero_empleado } = req.body;
    const query='select * from invitados where numero_empleado=?';
    conn.query(query, [numero_empleado], (err, data)=>{
        if(err){
            console.log(err);
            return res.status(500).send({error:"Error al obtener la información"});
        }else{
            return res.status(200).send(data);
        }
    })
}

function asistenciaDia(req,res){
    const { numero_empleado } = req.body;
    const query = 'update invitados set asistencia_dia=true where numero_empleado=?'
    conn.query(query, [numero_empleado], (err, data)=>{
        if(err) {
            console.error(err);
            return res.status(500).send({ message: 'Error al registrar asistencia' });
        }
        return res.status(200).send({ 
            message: 'Asistencia registrada correctamente',
        });
    })
}

function asistencaNoche(req,res){
    const { numero_empleado } = req.body;
    const query = 'update invitados set asistencia_noche=true where numero_empleado=?'
    conn.query(query, [numero_empleado], (err, data)=>{
        if(err) {
            console.error(err);
            return res.status(500).send({ message: 'Error al registrar asistencia' });
        }
        return res.status(200).send({ 
            message: 'Asistencia registrada correctamente',
        });
    })
}

export const methods={
    getEmployee,
    asistencaNoche,
    asistenciaDia
}