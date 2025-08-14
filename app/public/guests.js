async function buscarInvitado() {
    const numero = parseInt(document.getElementById("numero_empleado").value);
    const tablaResultados = document.getElementById("tabla-resultados");
    const divResultado = document.getElementById("resultado");
    const alerta = document.getElementById("alerta");
    const botonAsistencia = document.getElementById("boton-asistencia");

    tablaResultados.innerHTML = "";
    alerta.style.display = "none";
    divResultado.style.display = "none";
    botonAsistencia.style.display = "none";

    if (!numero) {
        alert("Por favor ingresa un número de empleado válido.");
        return;
    }
    
    const response = await fetch("http://localhost:4000/getEmployee", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numero_empleado: numero })
    });

    const invitado = await response.json();
    console.log(invitado);

    if (invitado.length >= 1) {
    const asistio = invitado[0].asistencia_dia; // viene desde la DB

    tablaResultados.innerHTML = `
        <tr>
            <td>${invitado[0].numero_empleado}</td>
            <td>${invitado[0].nombre}</td>
            <td>${invitado[0].acompanantes_noche}</td>
        </tr>
    `;

    // Cambiar el mensaje de alerta según asistencia
    if (asistio) {
        alerta.textContent = "El invitado ya tiene la asistencia registrada.";
    } else {
        alerta.textContent = "El invitado aún no tiene la asistencia registrada.";
    }
        alerta.style.display = "block";
        divResultado.style.display = "block";
        botonAsistencia.style.display = asistio ? "none" : "block"; // Ocultar botón si ya asistió
    } else {
        alert("No se encontró un invitado con ese número de empleado.");
    }
}

async function registrarAsistencia() {
    const numero = parseInt(document.getElementById("numero_empleado").value);

    const response = await fetch("http://localhost:4000/registrarAsistenciaDia", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numero_empleado: numero })
    });

    const result = await response.json();
    console.log(result.message);
    alert(result.message);
}
