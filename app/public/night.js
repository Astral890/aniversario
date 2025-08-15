let acompanantesTemp = 0;

async function buscarInvitado() {
    const numero = parseInt(document.getElementById("numero_empleado").value);
    const tablaResultados = document.getElementById("tabla-resultados");
    const divResultado = document.getElementById("resultado");
    const alerta = document.getElementById("alerta");
    const botonAcciones = document.getElementById("boton-acciones");

    tablaResultados.innerHTML = "";
    alerta.style.display = "none";
    divResultado.style.display = "none";
    botonAcciones.style.display = "none";

    if (!numero) {
        alert("Por favor ingresa un número de empleado válido.");
        return;
    }

    const response = await fetch("http://localhost:4000/getEmployee", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_empleado: numero })
    });

    const invitado = await response.json();

    if (invitado.length >= 1) {
        const asistio = invitado[0].asistencia_noche;
        acompanantesTemp = invitado[0].acompanantes_noche;

        tablaResultados.innerHTML = `
            <tr>
                <td>${invitado[0].numero_empleado}</td>
                <td>${invitado[0].nombre}</td>
                <td>
                    <button onclick="cambiarAcompanantes(-1)">-</button>
                    <span id="acompanantes-valor">${acompanantesTemp}</span>
                    <button onclick="cambiarAcompanantes(1)">+</button>
                </td>
            </tr>
        `;

        alerta.textContent = asistio
            ? "El invitado ya tiene la asistencia registrada."
            : "El invitado aún no tiene la asistencia registrada.";

        alerta.style.display = "block";
        divResultado.style.display = "block";
        botonAcciones.style.display = "flex";
    } else {
        alert("No se encontró un invitado con ese número de empleado.");
    }
}

function cambiarAcompanantes(delta) {
    if (acompanantesTemp + delta >= 0) {
        acompanantesTemp += delta;
        document.getElementById("acompanantes-valor").textContent = acompanantesTemp;
    }
}

async function registrarAsistencia() {
    const numero = parseInt(document.getElementById("numero_empleado").value);
    const response = await fetch("http://localhost:4000/registrarAsistenciaNoche", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_empleado: numero })
    });

    const result = await response.json();
    alert(result.message);
}

async function actualizarAcompanantes() {
    const numero = parseInt(document.getElementById("numero_empleado").value);
    const response = await fetch("http://localhost:4000/actualizarNoche", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            numero_empleado: numero,
            acompanantes_noche: acompanantesTemp
        })
    });

    const result = await response.json();
    alert(result.message);
    window.location.reload();
}
