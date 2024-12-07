var socios = [];
var inscripcion = [];
var errorContainer;
var successContainer;
var dataTable;
var pagos = [];

document.addEventListener('DOMContentLoaded', async function () {
    const navbar = document.querySelector('.navbar');
    successContainer = document.getElementById('successContainer');
    errorContainer = document.getElementById('errorContainer');
    $('#formPagoUp').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalUpPago').click();
    
        // Obtener los valores del formulario
        const id = $('#idPagoUp').val();
        const pago1 = parseFloat($('#pago1Up').val()) || 0;
        const fechaP1 = $('#fechaPago1Up').val();
        const pago2 = parseFloat($('#pago2Up').val()) || 0;
        const fechaP2 = $('#fechaPago2Up').val();
        const pago3 = parseFloat($('#pago3Up').val()) || 0;
        const fechaP3 = $('#fechaPago3Up').val();
        const total = parseFloat($('#totalUp').val()) || 0;
        const idInscripcion = $('#pagoUp1').val();
        const concepto = $('#conceptoUp').val();
        // Validación de campos obligatorios
        if (!id || !concepto || !total || !idInscripcion) {
            showError(errorContainer, 'Por favor, complete todos los campos obligatorios.');
            return;
        }
    
        // Validación del orden de los pagos
        if (pago1 === 0 && (pago2 > 0 || pago3 > 0)) {
            showError(errorContainer, 'Debe completar el pago 1 antes de realizar pagos posteriores.');
            return;
        }
        if (pago2 === 0 && pago3 > 0) {
            showError(errorContainer, 'Debe completar el pago 2 antes de realizar el pago 3.');
            return;
        }
        const subtotal = pago1 + pago2 + pago3;
        const restante = total - subtotal;
    
        // Validación: Subtotal no excede el total
        if (subtotal > total) {
            showError(errorContainer, 'El subtotal de los pagos no puede exceder el total.');
            return;
        }
    
        // Realizar la petición POST al servidor
        fetch('/socios/editarPago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                pago1,
                fechaP1,
                pago2,
                fechaP2,
                pago3,
                fechaP3,
                subtotal,
                restante,
                total,
                idInscripcion,
                concepto
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al editar pago');
                }
                return response.json();
            })
            .then(data => {
                console.log('Pago editado:', data);
                showAlert(successContainer, 'Pago editado correctamente', 'alert-success');
                $('#pagosTab').DataTable().destroy();
                llenarPagos();
            })
            .catch(error => {
                console.error('Error al editar pago:', error);
                showError(errorContainer, 'No se pudo editar el pago.');
            });
    });
    
    $('#formInscripcionUp').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalUpInscripcion').click();
        // Obtener los valores del formulario
        const id = $('#idInscripcionUp').val();
        const fechaVencimiento = $('#fechaVencimientoUp').val();
        const estado = $('#estadoUp').val();
        const fechaReinscripcion = $('#fechaReinscripcionUp').val();

        // Validación de los campos
        if (!id || !fechaVencimiento || !estado || !fechaReinscripcion) {
            showError(errorContainer, 'Por favor, complete todos los campos.');
            return;
        }

        // Realizar la petición POST al servidor
        fetch('/socios/editarInscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                fechaVencimiento,
                estado,
                fechaReinscripcion
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al editar inscripción');
                }
                return response.json();
            })
            .then(data => {
                
                showAlert(successContainer, 'Inscripción editada correctamente', 'alert-success');
                $('#inscripcionTab').DataTable().destroy();
                llenarInscripcion();
            })
            .catch(error => {
                console.error('Error al editar inscripción:', error);
                showError(errorContainer, 'No se pudo editar la inscripción.');
            });
    });
    $('#formSocioUp').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalUpSocio').click();
        // Obtener los valores del formulario
        const id = $('#id').val();
        const nombre = $('#nombreUpSocio').val();
        const apellido = $('#apellidoUpSocio').val();
        const fechaNacimiento = $('#fechaNacimientoUpSocio').val();
        const fechaInscripcion = $('#fechaInscripcionUpSocio').val();
        const email = $('#emailUpSocio').val();
        const telefono = $('#telefonoUpSocio').val();
        const seccion = $('#seccionUpSocio').val();

        // Validación de los campos
        if (!id || !nombre || !apellido || !fechaNacimiento || !fechaInscripcion) {
            showError(errorContainer, 'Por favor, complete todos los campos.');
            return;
        }

        // Realizar la petición POST al servidor
        fetch('/socios/editarSocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                nombre,
                apellido,
                fechaNacimiento,
                fechaInscripcion,
                email,
                telefono,
                seccion
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al editar socio');
                }
                return response.json();
            })
            .then(data => {
                console.log('Socio editado:', data);
                showAlert(successContainer, 'Socio editado correctamente', 'alert-success');
                $('#tabSocios').DataTable().destroy();
                llenarSocios();
            })
            .catch(error => {
                console.error('Error al editar socio:', error);
                showError(errorContainer, 'No se pudo editar el socio.');
            });
    });
    $('#formPago').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalPago').click();
    
        // Obtener los valores del formulario
        const id = $('#inscripcion').val() + $('#idPago').val();
        const pago1 = parseFloat($('#pago1').val()) || 0;
        const fechaP1 = $('#fechaP1').val();
        const pago2 = parseFloat($('#pago2').val()) || 0;
        const fechaP2 = $('#fechaP2').val();
        const pago3 = parseFloat($('#pago3').val()) || 0;
        const fechaP3 = $('#fechaP3').val();
        const fechaPago = $('#fechaPago').val();
        const idInscripcion = $('#inscripcion').val();
        const concepto = $('#concepto').val();
        const total = parseFloat($('#total').val()) || 0;
    
        if (pago1 === 0 && (pago2 > 0 || pago3 > 0)) {
            showError(errorContainer, 'Debe completar el pago 1 antes de realizar pagos posteriores.');
            return;
        }
        if (pago2 === 0 && pago3 > 0) {
            showError(errorContainer, 'Debe completar el pago 2 antes de realizar el pago 3.');
            return;
        }
    
    
        // Validación de los campos obligatorios
        if (!id || !concepto || total <= 0) {
            showError(errorContainer, 'Por favor, complete todos los campos obligatorios correctamente.');
            return;
        }
    
        const subtotal = pago1 + pago2 + pago3;
        const restante = total - subtotal;
    
        // Verificar que los pagos no excedan el total
        if (subtotal > total) {
            showError(errorContainer, 'El subtotal de los pagos no puede exceder el total.');
            return;
        }
    
        // Realizar la petición POST al servidor
        fetch('/socios/agregarPago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                pago1,
                fechaP1,
                pago2,
                fechaP2,
                pago3,
                fechaP3,
                fechaPago,
                idInscripcion,
                concepto,
                subtotal,
                restante,
                total
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al agregar pago');
                }
                return response.json();
            })
            .then(data => {
                console.log('Pago agregado:', data);
                showAlert(successContainer, 'Pago agregado correctamente', 'alert-success');
    
                // Actualizar los datos en la tabla
                $('#tabPagos').DataTable().destroy();
                llenarPagos();
            })
            .catch(error => {
                console.error('Error al agregar pago:', error);
                showError(errorContainer, 'No se pudo agregar el pago.');
            });
    });
    


    $('#inscripcion').on('change', function () {
        if (pagos && pagos.length > 0) {
            const inscripcion = pagos[pagos.length - 1].id;
            const newId = `${$('#inscripcion').val().split('#')[2]}Pago#${parseInt(inscripcion.split('#')[1]) + 1}`;
            $('#idPago').val(newId);
        } else {
            $('#idPago').val(`${$('#inscripcion').val().split('#')[2]}Pago#1`);
        }
    });
    $('#inscripcionUp').on('change', function () {
        if (pagos && pagos.length > 0) {
            const inscripcion = pagos[pagos.length - 1].id;
            const newId = `${$('#inscripcionUp').val().split('#')[2]}Pago#${parseInt(inscripcion.split('#')[1]) + 1}`;
            $('#idPago').val(newId);
        } else {
            $('#idPago').val(`${$('#inscripcionUp').val().split('#')[2]}Pago#1`);
        }
    });
    // Mostrar/ocultar el navbar basado en la posición del mouse
    const btnMostrarOcultar = document.getElementById('btnMostrarOcultar');
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    navbar.classList.add('navbar-hidden');
    $('#btnMostrarOcultar').on('click', function () {
        if (navbar.classList.contains('navbar-hidden')) {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
            btnMostrarOcultar.style.marginTop = `${navbar.offsetHeight}px`;
            contenidoPrincipal.style.marginTop = `70px`;
        } else {
            navbar.classList.add('navbar-hidden');
            navbar.classList.remove('navbar-visible');
            btnMostrarOcultar.style.marginTop = '3px'; // Regresa el botón a su posición original
            contenidoPrincipal.style.marginTop = '12px';
        }
    });
    $('#btnAgregarInscripcion').on('click', function () {
        if (socios && socios.length > 0 && inscripcion && inscripcion.length > 0) {
            const lastId = socios[socios.length - 1].id;
            const id2 = inscripcion[inscripcion.length - 1].id;
            const id = `${lastId}#Inscripcion-${parseInt(id2.split('-')[1]) + 1}`;
            $('#idInscripcion').val(id);
        } else {
            $('#idInscripcion').val(`${socios[socios.length - 1].id}#Inscripcion-1`);
        }
    });

    $('#formInscripcion').on('submit', function (event) {
        event.preventDefault();

        $('#btnCerrarModal').click();
        const id = $('#idInscripcion').val();
        const fechaVencimiento = $('#fechaVencimiento').val();
        const estado = $('#estado').val();
        const fechaReinscripcion = $('#fechaReinscripcion').val();
        fetch('/socios/setInscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                fechaVencimiento,
                estado,
                fechaReinscripcion,
                socioId: socios[socios.length - 1].id
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar la inscripcion');
                }
                return response.json();
            })
            .then(data => {
                console.log('Inscripcion actualizada:', data);
                showAlert(successContainer, 'Inscripcion actualizada correctamente', 'alert-success');
                $('#tabInscripcion').DataTable().destroy();
                llenarInscripcion();
            })
            .catch(error => {
                console.error('Error al actualizar la inscripcion:', error);
                showError(errorContainer, 'No se pudo actualizar la inscripcion.');
            });
    });
    llenarSocios();
    llenarInscripcion();
    llenarPagos();
    cargarComprobantes();
    document.getElementById('filtroComprobante').addEventListener('change', function () {
        const selectedEstado = this.value === 'Todo' ? '' : this.value;
        const table = $('#comprobantesTab').DataTable();
        table.column(2).search(selectedEstado).draw();
    });
});

function llenarInscripcion() {
    fetch('/socios/getInscripcion')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la inscripción');
            }
            return response.json();
        })
        .then(data => {
            console.log('Inscripciones obtenidas:', JSON.stringify(data));
            if (data && data.length > 0) {
                inscripcion = data;
                // Limpia el contenido previo de la tabla
                $('#inscripBod').empty();
                data.forEach((item, i) => {
                    const tr = document.createElement('tr');
                    var fecha1=item.fechaVencimiento.split('T')[0];
                    var fecha2=item.fechaReinscripcion.split('T')[0];
                    tr.innerHTML = `
                        <td>${item.id.split('#')[2]}</td>
                        <td>${fecha1.split('-')[2]}/${fecha1.split('-')[1]}/${fecha1.split('-')[0]}</td>
                        <td>${item.estado}</td>
                        <td>${fecha2.split('-')[2]}/${fecha2.split('-')[1]}/${fecha2.split('-')[0]}</td>
                        <td>
                            <div class="d-flex align-items-center justify-content-between">
                                <button onclick="eliminarInscripcion('${item.id}')" style="border: none; background-color: rgba(255, 255, 255, 0.374);"><i class="bi bi-trash" style="color:red;"></i></button>
                                <button data-toggle="modal" data-target="#modalEditarInscripcion" id='btnEditarInscripcion${i}' style="border: none; background-color: rgba(255, 255, 255, 0.374);"><i class="bi bi-pencil" style="color: black;"></i></button>
                            </div>
                        </td>
                        `;

                    $('#inscripBod').append(tr);
                    $(`#btnEditarInscripcion${i}`).on('click', function () {
                        const id = inscripcion[i].id;
                        const fechaVencimiento = new Date(inscripcion[i].fechaVencimiento).toISOString().split('T')[0]; // Formateo de fecha
                        const estado = inscripcion[i].estado;
                        const fechaReinscripcion = new Date(inscripcion[i].fechaReinscripcion).toISOString().split('T')[0]; // Formateo de fecha

                        // Asignar valores a los campos del formulario
                        $('#idInscripcionUp').val(id);
                        $('#fechaVencimientoUp').val(fechaVencimiento);
                        $('#estadoUp').val(estado);
                        $('#fechaReinscripcionUp').val(fechaReinscripcion);
                    });
                });
                $('#inscripcionTab').DataTable({
                    "pageLength": 5,
                    "lengthMenu": [[5, 10, 15, 20, -1], [5, 10, 15, 20, "Todos"]],
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
                    }
                });
                llenarComboboxInscripcion();
                if (pagos && pagos.length == 0) {
                    $('#idPago').val(`${$('#inscripcion').val().split('#')[2]}Pago#1`);
                }
            } else {
                $('#inscripBod').empty();
                const tr = document.createElement('tr');
                const cell = document.createElement('td');
                cell.setAttribute('colspan', '5');
                cell.textContent = 'No hay inscripciones que mostrar';
                cell.style.textAlign = 'center';
                tr.appendChild(cell);
                $('#inscripBod').append(tr);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al cargar las inscripciones.');
        });
}
window.eliminarInscripcion = function (id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
        fetch('/socios/eliminarInscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar inscripción');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    $('#tabInscripcion').DataTable().destroy();
                    inscripcion.length = 0;
                    showAlert(successContainer, 'Inscripcion eliminada correctamente', 'alert-success');
                    llenarInscripcion();
                }
            })
            .catch(error => {
                console.error('Error al eliminar inscripción:', error);
                showError(errorContainer, 'No se pudo eliminar la inscripción.');
            });
    }
};
function llenarComboboxInscripcion() {
    $('#inscripcion').empty();
    $('#pagoUp1').empty();
    inscripcion.forEach(inscripcion => {
        const option = document.createElement('option');
        option.value = inscripcion.id;
        option.text = inscripcion.id.split('#')[2];
        $('#inscripcion').append(option);
        // Crear una opción para el segundo combobox
        const optionInscripcionUp = document.createElement('option');
        optionInscripcionUp.value = inscripcion.id;
        optionInscripcionUp.text = inscripcion.id.split('#')[2];
        $('#pagoUp1').append(optionInscripcionUp);
    });

}


function llenarComboboxComprobantes() {
    // Limpia el contenido existente
    $('#comprobanteOption').empty();
    $('#filtroComprobante').empty();
    const todo= document.createElement('option');
    todo.value='Todo';
    todo.text='Todo';
    $('#filtroComprobante').append(todo);
    $
    pagos.forEach(pago => {
        // Extraer las coincidencias de los patrones
        const inscripcion = pago.id.match(/Inscripcion-\d+/)?.[0] || 'Sin inscripción';
        const pagoNumero = pago.id.match(/Pago#\d+/)?.[0] || 'Sin número';

        // Crear la opción para 'comprobanteOption'
        const option1 = document.createElement('option');
        option1.value = pago.id;
        option1.text = `${inscripcion} ${pagoNumero}`;
        $('#comprobanteOption').append(option1);

        // Crear la opción para 'filtroComprobante'
        const option2 = document.createElement('option');
        option2.value = `${inscripcion}`;
        option2.text = `${inscripcion}`;
        $('#filtroComprobante').append(option2);
    });
}

function llenarSocios() {
    fetch('/socios/getSocio')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener socios');
            }
            return response.json();
        })
        .then(data => {
            socios = data;
            $('#titulo').text('Detalles de '+socios[0].nombre+' '+socios[0].apelllidos);
            $('#sociosBody').empty(); // Limpiar el contenido actual de la tabla
            if (data && data.length > 0) {
                data.forEach((socio, i) => {
                    const tr = document.createElement('tr');
                    var fecha1=socio.fechaNacimiento.split('T')[0];
                    var fecha2=socio.fechaInscripcion.split('T')[0];
                    tr.innerHTML = `
                    <td>${socio.id}</td>
                    <td>${socio.nombre}</td>
                    <td>${socio.apelllidos}</td>
                    <td>${fecha1.split('-')[2]}/${fecha1.split('-')[1]}/${fecha1.split('-')[0]}</td>
                    <td>${fecha2.split('-')[2]}/${fecha2.split('-')[1]}/${fecha2.split('-')[0]}</td>
                    <td>${socio.email || 'N/A'}</td>
                    <td>${socio.telefono || 'N/A'}</td>
                    <td>${socio.seccion || 'N/A'}</td>
                    <td>
                        <div class="d-flex align-items-center justify-content-between">
                            <button onclick="eliminarSocio('${socio.id}')" style="border: none; background-color: rgba(255, 255, 255, 0.374);"><i class="bi bi-trash" style="color:red;"></i></button>
                            <button data-toggle="modal" data-target="#modalEditarSocio" id='btnEditarSocio${i}' style="border: none; background-color: rgba(255, 255, 255, 0.374);"><i class="bi bi-pencil" style="color: black;"></i></button>
                        </div>
                    </td>
                `;

                    $('#sociosBody').append(tr);
                    $(`#btnEditarSocio${i}`).on('click', function () {
                        const id = socio.id;
                        const nombre = socio.nombre;
                        const apellido = socio.apelllidos; // Corrección del error tipográfico
                        const fechaNacimiento = new Date(socio.fechaNacimiento).toISOString().split('T')[0]; // Formateo de fecha
                        const fechaInscripcion = new Date(socio.fechaInscripcion).toISOString().split('T')[0]; // Formateo de fecha
                        const email = socio.email;
                        const telefono = socio.telefono;
                        const seccion = socio.seccion;

                        // Asignar valores a los campos del formulario
                        $('#id').val(id);
                        $('#nombreUpSocio').val(nombre);
                        $('#apellidoUpSocio').val(apellido);
                        $('#fechaNacimientoUpSocio').val(fechaNacimiento);
                        $('#fechaInscripcionUpSocio').val(fechaInscripcion);
                        $('#emailUpSocio').val(email);
                        $('#telefonoUpSocio').val(telefono);
                        $('#seccionUpSocio').val(seccion);
                    });
                });

                // Iniciar DataTable después de llenar la tabla
                $('#tabSocios').DataTable({
                    "pageLength": 5,
                    "lengthMenu": [[5, 10, 15, 20, -1], [5, 10, 15, 20, "Todos"]],
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
                    }
                });
            } else {
                const tr = document.createElement('tr');
                const cell = document.createElement('td');
                cell.setAttribute('colspan', '9');
                cell.textContent = 'No hay socios que mostrar';
                cell.style.textAlign = 'center';
                tr.appendChild(cell);
                $('#sociosBody').append(tr);
            }
        })
        .catch(error => {
            console.error('Error al obtener socios:', error);
            showError(errorContainer, 'No se pudo obtener la lista de socios.');
        });
}
window.eliminarSocio = function (id) {
    if (confirm('¿Estás seguro de que deseas eliminar este socio?')) {
        fetch('/socios/eliminarSocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar socio');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    $('#tabSocios').DataTable().destroy();
                    alert('Socio eliminado correctamente');
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.error('Error al eliminar socio:', error);
                showError(errorContainer, 'No se pudo eliminar el socio.');
            });
    }
}

// Funciones para mostrar alertas
function showAlert(container, message, alertClass) {
    container.textContent = message;
    container.className = `alert ${alertClass}`;
    container.classList.remove('hidden');
    setTimeout(() => {
        container.classList.add('hidden');
    }, 5000);
}

function showError(container, message) {
    container.textContent = message;
    container.className = `alert alert-danger`;
    container.classList.remove('hidden');
    setTimeout(() => {
        container.classList.add('hidden');
    }, 5000);
}

function llenarPagos() {
    fetch('/socios/getPagos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener pagos');
            }
            return response.json();
        })
        .then(data => {
            pagos = data; // Asegurar que `data` no sea null
            if (data && data.length > 0) {
                        // Limpiar el contenido actual de la tabla
            $('#pagosBody').empty();
                pagos.forEach((pago, i) => {
                    const no_pago = (pago.id.match(/Inscripcion-\d+/) || ['N/A'])[0]; // Valor predeterminado
                    const tr = `
                        <tr>
                            <td>${no_pago}</td>
                            <td>${pago.fecha ? new Date(pago.fecha).toLocaleDateString() : 'N/A'}</td>
                            <td>${pago.concepto || 'N/A'}</td>
                            <td>${pago.pago1 || 0}</td>
                            <td>${pago.fechaP1 ? new Date(pago.fechaP1).toLocaleDateString() : 'N/A'}</td>
                            <td>${pago.pago2 || 0}</td>
                            <td>${pago.fechaP2 ? new Date(pago.fechaP2).toLocaleDateString() : 'N/A'}</td>
                            <td>${pago.pago3 || 0}</td>
                            <td>${pago.fechaP3 ? new Date(pago.fechaP3).toLocaleDateString() : 'N/A'}</td>
                            <td>${pago.subtotal || 0}</td>
                            <td>${pago.restante || 0}</td>
                            <td>${pago.total || 0}</td>
                            <td id="estadoPago${i}">${pago.estado || 'N/A'}</td>
                            <td>
                                <div class="d-flex align-items-center justify-content-between">
                                    <button onclick="eliminarPago('${pago.id}')" class="btn btn-sm">
                                        <i class="bi bi-trash text-danger"></i>
                                    </button>
                                    <button data-toggle="modal" data-target="#modalEditarPago" 
                                            id="btnEditarPago${i}" 
                                            class="btn btn-sm">
                                        <i class="bi bi-pencil text-dark"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
                    $('#pagosBody').append(tr);
                    if(pago.estado=='pagado'){
                        $('#estadoPago'+i).html('<span class="badge bg-success">Pagado</span>');
                    }else if(pago.estado=='pendiente'){
                        $('#estadoPago'+i).html('<span class="badge bg-danger">Pendiente</span>');
                    }
                    // Agregar evento para el botón de edición
                    $(`#btnEditarPago${i}`).on('click', function () {
                        // Asignar valores a los campos del formulario
                        $('#idPagoUp').val(pago.id);
                        $('#inscripcionUp').val(pago.idInscripcion || '');
                        $('#fechaPagoUp').val(pago.fecha ? pago.fecha.split('T')[0] : '');
                        $('#conceptoUp').val(pago.concepto || '');
                        $('#pago1Up').val(pago.pago1 || 0);
                        $('#fechaPago1Up').val(pago.fechaP1 ? pago.fechaP1.split('T')[0] : '');
                        $('#pago2Up').val(pago.pago2 || 0);
                        $('#fechaPago2Up').val(pago.fechaP2 ? pago.fechaP2.split('T')[0] : '');
                        $('#pago3Up').val(pago.pago3 || 0);
                        $('#fechaPago3Up').val(pago.fechaP3 ? pago.fechaP3.split('T')[0] : '');
                        $('#subtotalUp').val(pago.subtotal || 0);
                        $('#restanteUp').val(pago.restante || 0);
                        $('#totalUp').val(pago.total || 0);
                        $('#idInscripcionUp').val(pago.idInscripcion || '');
                    });
                });
            
                // Inicializar DataTable
                $('#pagosTab').DataTable({
                    pageLength: 5,
                    lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "Todos"]],
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
                    }
                });

                // Llamar funciones adicionales
                llenarComboboxComprobantes();
            } else {
                $('#pagosBody').empty();
                $('#pagosBody').append(`
                    <tr>
                        <td colspan="14" class="text-center">No hay pagos que mostrar</td>
                    </tr>
                `);
            }
        })
        .catch(error => {
            console.error('Error al obtener pagos:', error);
            showError(errorContainer, 'No se pudo obtener la lista de pagos.');
        });
}

window.eliminarPago = function (id) {
    if (confirm('¿Estás seguro de que deseas eliminar este pago?')) {
        fetch('/socios/eliminarPago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar pago');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    $('#tabPagos').DataTable().destroy();
                    showAlert(successContainer, 'Pago eliminado correctamente', 'alert-success');
                    pagos.length = 0;
                    llenarPagos();
                }
               
            })
            .catch(error => {
                console.error('Error al eliminar pago:', error);
                showError(errorContainer, 'No se pudo eliminar el pago.');
            });
    }
};

function cargarComprobantes() {

    fetch('/socios/comprobantes')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
             
                const tbody = document.getElementById('comprobantesBody');
                tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

                // Llenar la tabla con los datos
                data.forEach((comprobante,i) => {
                    const row = document.createElement('tr');

                    // Formatear la fecha antes de mostrarla
                    const fechaFormateada = new Date(comprobante.fecha_subida).toLocaleDateString();

                    row.innerHTML = `
                    <td>${comprobante.id}</td>
                    <td><a href="#" onclick="descargarComprobante('${comprobante.id}'); return false;">${comprobante.nombre_archivo}</a></td>
                    <td>${comprobante.pago_id.match(/Inscripcion-\d+/)+' '+comprobante.pago_id.match(/Pago#\d+/)}.${comprobante.NoPago}</td>
                    <td>${fechaFormateada}</td>
                    <td>
                        <div class="d-flex align-items-center justify-content-between">
                            <button class="btn" onclick="eliminarComprobante('${comprobante.id}')" style="border: none; background-color: transparent;">
                                <i class="bi bi-trash" style="color: red; font-size: 1.2rem;"></i>
                            </button>
                            <button class="btn" onclick="visualizarComprobante('${comprobante.id}')" style="border: none; background-color: transparent;">
                                <i class="bi bi-eye" style="color: blue; font-size: 1.2rem;"></i>
                            </button>
                        </div>
                    </td>
                `;
                    llenarComboboxComprobantes();
                    tbody.appendChild(row);
                });
                $('#comprobantesTab').DataTable({
                    "pageLength": 5,
                    "lengthMenu": [[5, 10, 15, 20, -1], [5, 10, 15, 20, "Todos"]],
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
                    }
                });

            } else {
                const tbody = document.getElementById('comprobantesBody');
                tbody.innerHTML = '';
                const tr = document.createElement('tr');
                const cell = document.createElement('td');
                cell.setAttribute('colspan', '5');
                cell.textContent = 'No hay comprobantes que mostrar';
                cell.style.textAlign = 'center';
                tr.appendChild(cell);
                $('#comprobantesBody').append(tr);
            }
        })
        .catch(error => console.error('Error al cargar los comprobantes:', error));
}
window.eliminarComprobante = function (id) {
    if (confirm('¿Estás seguro de que deseas eliminar este comprobante?')) {
        fetch('/socios/eliminarComprobante', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar comprobante');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showAlert(successContainer, 'Pago editado correctamente', 'alert-success');
                    $('#comprobantesTab').DataTable().destroy();
                    cargarComprobantes();
                }
            })
            .catch(error => {
                console.error('Error al eliminar comprobante:', error);
                showError(errorContainer, 'No se pudo eliminar el comprobante.');
            });
    }
};
function visualizarComprobante(id) {
    // Codificar el ID para manejar caracteres especiales como #
    const encodedId = encodeURIComponent(id);

    // Suponiendo que tu backend tiene una ruta para obtener la URL y tipo del archivo
    fetch(`/socios/visualizarComprobante/${encodedId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo visualizar el comprobante.');
            }
            return response.json(); // Suponiendo que el backend envía un objeto con la URL y el tipo
        })
        .then(data => {
            if (data && data.url) {
                window.open(data.url, '_blank'); // Abrir el archivo en una nueva pestaña
            } else {
                console.error('No se encontró una URL o tipo para el comprobante.');
            }
        })
        .catch(error => console.error('Error al visualizar el comprobante:', error));
}






function descargarComprobante(id) {
    fetch('/socios/descargar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al descargar el comprobante');
            }
            // Espera la respuesta como un Blob (archivo binario)
            return response.blob().then(blob => {
                // Extraer el nombre del archivo desde las cabeceras de la respuesta
                const contentDisposition = response.headers.get('Content-Disposition');
                const matches = /filename="([^"]+)"/.exec(contentDisposition);
                const fileName = matches && matches[1] ? matches[1] : 'archivo_sin_extension'; // Si no hay nombre, usar un valor predeterminado

                // Crear un enlace temporal para descargar el archivo
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName; // Nombre del archivo con extensión
                link.click(); // Simula el clic para iniciar la descarga
                console.log('Comprobante descargado');
                showAlert(successContainer, 'Comprobante descargado correctamente', 'alert-success');
            });
        })
        .catch(error => {
            console.error('Error al descargar el comprobante:', error);
            showError(errorContainer, 'No se pudo descargar el comprobante.');
        });
}


