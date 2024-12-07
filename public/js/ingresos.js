var errorContainer;
var successContainer;
var ingresos = [];
var egresos = [];
var ctx;
var idEditar;
let chart; // Variable global para almacenar el gráfico

document.addEventListener('DOMContentLoaded', function () {
    if ($(window).width() < 768) {
        // Ajustes adicionales para pantallas pequeñas
        $('.nav-link').addClass('text-center');
    }
    const navbar = document.querySelector('.navbar');
    successContainer = document.getElementById('successContainer');
    errorContainer = document.getElementById('errorContainer');
    $('#formEgresoEditar').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalEditarEgreso').click();
        // Obtener los valores del formulario
        const concepto = $('#conceptoEgresoEditar').val();
        const mes = $('#mesEgresoEditar').val();
        const fecha = $('#fechaEgresoEditar').val();
        const cantidad = $('#cantidadEgresoEditar').val();
        const subtotal = $('#subtotalEgresoEditar').val();
        const total = $('#totalEgresoEditar').val();
        const formaPago = $('#formaPagoEgresoEditar').val();
        const referencia = $('#referenciaEgresoEditar').val();
        fetch('/ingresos/editarEgreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                concepto,
                mes,
                fecha,
                cantidad,
                subtotal,
                total,
                formaPago,
                referencia,
                id: idEditar
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al editar egreso');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Egreso editado:', data);
                    showAlert(successContainer, 'Egreso editado correctamente', 'alert-success');
                    $('#egresosTab').DataTable().destroy();
                    llenarDatos();
                    llenarEgresos();
                } else {
                    showError(errorContainer, 'No se pudo editar el egreso.');
                }
            })
            .catch(error => {
                console.error('Error al editar egreso:', error);
                showError(errorContainer, 'No se pudo editar el egreso.');
            });
    });
    $('#formIngresoEditar').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalEditarIngreso').click();
        // Obtener los valores del formulario
        const concepto = $('#conceptoIngresoEditar').val();
        const mes = $('#mesIngresoEditar').val();
        const fecha = $('#fechaIngresoEditar').val();
        const cantidad = $('#cantidadIngresoEditar').val();
        const subtotal = $('#subtotalIngresoEditar').val();
        const total = $('#totalIngresoEditar').val();
        const formaPago = $('#formaPagoIngresoEditar').val();
        const referencia = $('#referenciaIngresoEditar').val();
        fetch('/ingresos/editarIngreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                concepto,
                mes,
                fecha,
                cantidad,
                subtotal,
                total,
                formaPago,
                referencia,
                id: idEditar
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al editar ingreso');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Ingreso editado:', data);
                    showAlert(successContainer, 'Ingreso editado correctamente', 'alert-success');
                    $('#ingresosTab').DataTable().destroy();
                    llenarDatos();
                    llenarIngresos();
                } else {
                    showError(errorContainer, 'No se pudo editar el ingreso.');
                }
            })
            .catch(error => {
                console.error('Error al editar ingreso:', error);
                showError(errorContainer, 'No se pudo editar el ingreso.');
            });
    });
    $('#filtrar').on('click', function () {
        llenarDatos();
    });
    navbar.classList.add('navbar-hidden');
    // Mostrar/ocultar el navbar basado en la posición del mouse
    const btnMostrarOcultar = document.getElementById('btnMostrarOcultar');

    navbar.classList.add('navbar-hidden');
    $('#btnMostrarOcultar').on('click', function () {
        if (navbar.classList.contains('navbar-hidden')) {
            navbar.classList.remove('navbar-hidden');
            navbar.classList.add('navbar-visible');
            btnMostrarOcultar.style.marginTop = `${navbar.offsetHeight}px`;
        } else {
            navbar.classList.add('navbar-hidden');
            navbar.classList.remove('navbar-visible');
            btnMostrarOcultar.style.marginTop = '3px'; // Regresa el botón a su posición original
        }
    });
    llenarDatos();

    $('#formIngresoAgregar').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalAgregaringreso').click();

        // Obtener los valores del formulario
        const concepto = $('#conceptoIngreso').val();
        const mes = $('#mesIngreso').val();
        const fecha = $('#fechaIngreso').val();
        const cantidad = $('#cantidadIngreso').val();
        const subtotal = $('#subtotalIngreso').val();
        const total = $('#totalIngreso').val();
        const formaPago = $('#formaPagoIngreso').val();
        const referencia = $('#referenciaIngreso').val();
        fetch('/ingresos/agregarIngreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                concepto,
                mes,
                fecha,
                cantidad,
                subtotal,
                total,
                formaPago,
                referencia
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al agregar ingreso');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Ingreso agregado:', data);
                    showAlert(successContainer, 'Ingreso agregado correctamente', 'alert-success');
                    llenarDatos();
                    llenarIngresos();
                } else {
                    showError(errorContainer, 'No se pudo agregar el ingreso.');
                }
            })
            .catch(error => {
                console.error('Error al agregar ingreso:', error);
                showError(errorContainer, 'No se pudo agregar el ingreso.');
            });
    });
    $('#estadisticas2').addClass('hidden');
    document.getElementById('filtorEstadisticas').addEventListener('change', function () {
        // Mostrar el filtro adecuado
        const valor = this.value;
        if (valor === 'Mes') {
            $('#filtroMes').removeClass('hidden');
            $('#filtroAno').addClass('hidden');
            $('#btnFiltro').removeClass('hidden');
            $('#estadisticas1').removeClass('hidden');
            $('#estadisticas2').addClass('hidden');
            $('#estadisticas3').addClass('hidden');
            $('#filtroDec').addClass('hidden');
        } else if (valor === 'Año') {
            $('#filtroMes').addClass('hidden');
            $('#filtroAno').removeClass('hidden');
            $('#btnFiltro').removeClass('hidden');
            $('#estadisticas1').addClass('hidden');
            $('#estadisticas2').removeClass('hidden');
            $('#estadisticas3').addClass('hidden');
            $('#filtroDec').addClass('hidden');
        } else if (valor === 'General') {
            $('#filtroMes').addClass('hidden');
            $('#filtroAno').addClass('hidden');
            $('#btnFiltro').addClass('hidden');
            $('#estadisticas1').removeClass('hidden');
            $('#estadisticas2').addClass('hidden');
            $('#estadisticas3').addClass('hidden');
            $('#filtroDec').addClass('hidden');

            llenarDatos();
        } else if (valor === 'Decada') {
            $('#filtroMes').addClass('hidden');
            $('#filtroAno').addClass('hidden');
            $('#estadisticas2').addClass('hidden');
            $('#estadisticas1').addClass('hidden');
            $('#estadisticas3').removeClass('hidden');
            $('#filtroDec').removeClass('hidden');
            $('#btnFiltro').removeClass('hidden');

        }
    });
    $('#hasta').prop('disabled', true);
    $('#desde').on('change', function () {
        const valor = this.value; // Obtener el valor seleccionado en #desde

        if (valor === '') {
            // Si el valor está vacío, deshabilitar #hasta
            $('#hasta').val(null); // Limpiar el valor de #hasta
            $('#hasta').prop('disabled', true); // Deshabilitar #hasta
            $('#hasta').removeAttr('min'); // Eliminar el atributo min si existe
        } else {
            // Si hay un valor, habilitar #hasta y establecer el mínimo
            $('#hasta').prop('disabled', false); // Habilitar #hasta
            $('#hasta').attr('min', valor); // Establecer el mínimo en #desde
            $('#hasta').val(valor); // Establecer el valor de #hasta en #desde
        }
    });

    $('#hasta').on('change', function () {
        const valor = this.value;
        if (valor === '') {
            $('#hasta').val(null);
        }
    });
    $('#formEgreso').on('submit', function (event) {
        event.preventDefault();
        $('#btnCerrarModalAgregarEgreso').click();

        // Obtener los valores del formulario
        const concepto = $('#conceptoEgreso').val();
        const mes = $('#mesEgreso').val();
        const fecha = $('#fechaEgreso').val();
        const cantidad = $('#cantidadEgreso').val();
        const subtotal = $('#subtotalEgreso').val();
        const total = $('#totalEgreso').val();
        const formaPago = $('#formaPagoEgreso').val();
        const referencia = $('#referenciaEgreso').val();


        fetch('/ingresos/agregarEgreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                concepto,
                mes,
                fecha,
                cantidad,
                subtotal,
                total,
                formaPago,
                referencia
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al agregar egreso');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Egreso agregado:', data);
                    showAlert(successContainer, 'Egreso agregado correctamente', 'alert-success');
                    llenarDatos();
                    llenarEgresos();
                } else {
                    showError(errorContainer, 'No se pudo agregar el egreso.');
                }
            })
            .catch(error => {
                console.error('Error al agregar egreso:', error);
                showError(errorContainer, 'No se pudo agregar el egreso.');
            });
    });

    llenarIngresos();
    llenarEgresos();
    ctx = document.getElementById('graficoEstadisticas').getContext('2d');
})
//---------------------------empiezan funciones----------------------------------------------------------


// Función para mostrar un gráfico vacío en caso de error o datos inválidos
function generarGrafico(datos, etiquetas, tipo) {
    if (chart) {
        chart.destroy(); // Destruir el gráfico anterior si existe
    }

    // Colores únicos para cada elemento
    const coloresDeFondo = [
        'rgba(255, 99, 132, 0.5)', // Rojo
        'rgba(54, 162, 235, 0.5)', // Azul
        'rgba(75, 192, 192, 0.5)', // Verde
        'rgba(255, 206, 86, 0.5)', // Amarillo
        'rgba(153, 102, 255, 0.5)', // Morado
        'rgba(255, 159, 64, 0.5)', // Naranja
    ];
    const coloresDeBorde = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
    ];

    chart = new Chart(ctx, {
        type: tipo, // Tipo de gráfico: bar, line, pie, etc.
        data: {
            labels: etiquetas, // Etiquetas (ejes X)
            datasets: [
                {
                    label: 'Estadísticas',
                    data: datos, // Datos (ejes Y)
                    backgroundColor: coloresDeFondo.slice(0, datos.length), // Aplicar colores según cantidad de datos
                    borderColor: coloresDeBorde.slice(0, datos.length),
                    borderWidth: 1,
                },
            ],

        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                y: {
                    beginAtZero: true, // Asegurar que el eje Y comience en 0
                },
            },
        },
    });
}


function mostrarErrorEstadisticasMes() {
    const etiquetas = ['ingresos', 'egresos'];
    const datos = Array(12).fill(0);
    generarGrafico(datos, etiquetas, 'bar'); // Gráfico vacío
}
function mostrarErrorEstadisticasDecada() {
    const etiquetas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const datos = Array(10).fill(0);
    generarGrafico(datos, etiquetas, 'line'); // Gráfico vacío
}
function mostrarErrorEstadisticasAno() {
    const etiquetas = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const datos = Array(12).fill(0);
    generarGrafico(datos, etiquetas, 'line'); // Gráfico vacío
}

function mostrarErrorEstadisticasGeneral() {
    const etiquetas = ['Ingresos', 'Egresos'];
    const datos = [0, 0];
    generarGrafico(datos, etiquetas, 'pie'); // Gráfico vacío
}


function llenarIngresos() {
    fetch('/ingresos/getIngresos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener ingresos');
            }
            return response.json();
        })
        .then(data => {
            ingresos = data;
            $('#ingresosBody').empty(); // Limpiar el contenido actual de la tabla

            if (data && data.length > 0) {
                // Limpiar cualquier DataTable existente antes de crear una nueva
                if ($.fn.dataTable.isDataTable('#ingresosTab')) {
                    $('#ingresosTab').DataTable().clear().destroy();
                }

                data.forEach((ingreso, i) => {
                    const tr = document.createElement('tr');
                    const fecha = ingreso.fecha.split('T')[0]; // Simplificado a una sola variable
                    tr.innerHTML = `
                    <td style="background:rgba(228,228,228,255);">${fecha.split('-')[2]}/${fecha.split('-')[1]}/${fecha.split('-')[0]}</td>
                    <td style="background:rgba(228,228,228,255);">${ingreso.concepto}</td>
                    <td style="background:rgba(228,228,228,255);">${formatoNumero(ingreso.cantidad)}</td>
                    <td style="background:rgba(228,228,228,255);">${formatoNumero(ingreso.subtotal)}</td>
                    <td style="background:rgba(228,228,228,255);">${formatoNumero(ingreso.total)}</td>
                    <td style="background:rgba(228,228,228,255);">${ingreso.formaPago}</td>
                    <td style="background:rgba(228,228,228,255);">${ingreso.referencia}</td>
                    <td style="background:rgba(228,228,228,255);">
                        <div class="d-flex align-items-center justify-content-between">
                            <button onclick="eliminarIngreso('${ingreso.id}')" style="border: none; background-color: rgba(255, 255, 255, 0.374);">
                                <i class="bi bi-trash" style="color:red;"></i>
                            </button>
                            <button data-bs-toggle="modal"
                            data-bs-target="#modalEditarIngreso" id="btnEditarIngreso${i}" style="border: none; background-color: rgba(255, 255, 255, 0.374);">
                                <i class="bi bi-pencil" style="color: black;"></i>
                            </button>
                        </div>
                    </td>
                `;
                    $('#ingresosBody').append(tr);
                    $(`#btnEditarIngreso${i}`).on('click', function () {
                        // Asignar valores a los campos del formulario
                        idEditar = ingreso.id;
                        $('#conceptoIngresoEditar').val(ingreso.concepto);
                        $('#mesIngresoEditar').val(ingreso.mes);
                        $('#fechaIngresoEditar').val(ingreso.fecha.split('T')[0]);
                        $('#cantidadIngresoEditar').val(ingreso.cantidad);
                        $('#subtotalIngresoEditar').val(ingreso.subtotal);
                        $('#totalIngresoEditar').val(ingreso.total);
                        $('#formaPagoIngresoEditar').val(ingreso.formaPago);
                        $('#referenciaIngresoEditar').val(ingreso.referencia);
                        $('#idIngreso').val(ingreso.id);
                    });
                });

                // Iniciar DataTable después de llenar la tabla
                $('#ingresosTab').DataTable({
                    "pageLength": 5,
                    "lengthMenu": [[5, 10, 15, 20, -1], [5, 10, 15, 20, "Todos"]],
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
                    }
                });
            } else {
                const tr = document.createElement('tr');
                const cell = document.createElement('td');
                cell.setAttribute('colspan', '8');
                cell.textContent = 'No hay ingresos que mostrar';
                cell.style.textAlign = 'center';
                tr.appendChild(cell);
                $('#ingresosBody').append(tr);
            }
        })
        .catch(error => {
            console.error('Error al obtener ingresos:', error);
            const errorContainer = $('#errorContainer'); // Suponiendo que este es el contenedor para los errores
            errorContainer.text('No se pudo obtener la lista de ingresos.');
        });
}

function llenarEgresos() {
    fetch('/ingresos/getEgresos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener egresos');
            }
            return response.json();
        })
        .then(data => {
            // Limpiar tabla y destruir DataTable si existe
            const tabla = $('#egresosTab').DataTable();
            if ($.fn.DataTable.isDataTable('#egresosTab')) {
                tabla.clear().destroy();
            }

            $('#egresosBody').empty(); // Limpiar contenido actual de la tabla

            if (data && data.length > 0) {
                data.forEach((egreso, i) => {
                    const tr = document.createElement('tr');
                    const fechaFormateada = egreso.fecha.split('T')[0].split('-').reverse().join('/');

                    tr.innerHTML = `
                        <td style="background:rgba(228,228,228,255);">${fechaFormateada}</td>
                        <td style="background:rgba(228,228,228,255);">${egreso.concepto}</td>
                        <td style="background:rgba(228,228,228,255);">${formatoNumero(egreso.cantidad)}</td>
                        <td style="background:rgba(228,228,228,255);">${formatoNumero(egreso.subtotal)}</td>
                        <td style="background:rgba(228,228,228,255);">${formatoNumero(egreso.total)}</td>
                        <td style="background:rgba(228,228,228,255);">${egreso.formaPago}</td>
                        <td style="background:rgba(228,228,228,255);">${egreso.referencia}</td>
                        <td style="background:rgba(228,228,228,255);">
                            <div class="d-flex align-items-center justify-content-between">
                                <button onclick="eliminarEgreso('${egreso.id}')" class="btn btn-light btn-sm">
                                    <i class="bi bi-trash text-danger"></i>
                                </button>
                                <button data-bs-toggle="modal"
                            data-bs-target="#modalEditarEgreso" id="btnEditarEgreso${i}" style="border: none; background-color: rgba(255, 255, 255, 0.374);">
                                    <i class="bi bi-pencil text-dark"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    $('#egresosBody').append(tr);
                    $(`#btnEditarEgreso${i}`).on('click', function () {
                        // Asignar valores a los campos del formulario
                        idEditar = egreso.id;
                        $('#conceptoEgresoEditar').val(egreso.concepto);
                        $('#mesEgresoEditar').val(egreso.mes);
                        $('#fechaEgresoEditar').val(egreso.fecha.split('T')[0]);
                        $('#cantidadEgresoEditar').val(egreso.cantidad);
                        $('#subtotalEgresoEditar').val(egreso.subtotal);
                        $('#totalEgresoEditar').val(egreso.total);
                        $('#formaPagoEgresoEditar').val(egreso.formaPago);
                        $('#referenciaEgresoEditar').val(egreso.referencia);
                        $('#idEgreso').val(egreso.id);
                    });
                });

                // Inicializar DataTable
                $('#egresosTab').DataTable({
                    "pageLength": 5,
                    "lengthMenu": [[5, 10, 15, 20, -1], [5, 10, 15, 20, "Todos"]],
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
                    }
                });
            } else {
                // Mostrar mensaje si no hay egresos
                const tr = document.createElement('tr');
                const cell = document.createElement('td');
                cell.setAttribute('colspan', '8');
                cell.textContent = 'No hay egresos que mostrar';
                cell.style.textAlign = 'center';
                tr.appendChild(cell);
                $('#egresosBody').append(tr);
            }
        })
        .catch(error => {
            console.error('Error al obtener egresos:', error);
            alert('No se pudo obtener la lista de egresos. Intente nuevamente más tarde.');
        });
}

window.eliminarIngreso = function (id) {
    if (confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
        fetch('/ingresos/eliminarIngreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar ingreso');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    $('#ingresosTab').DataTable().destroy();
                    showAlert(successContainer, 'Ingreso eliminado correctamente', 'alert-success');
                    llenarDatos();
                    llenarIngresos();
                }
            })
            .catch(error => {
                console.error('Error al eliminar ingreso:', error);
                showError(errorContainer, 'No se pudo eliminar el ingreso.');
            });
    }
};
window.eliminarEgreso = function (id) {
    if (confirm('¿Estás seguro de que deseas eliminar este egreso?')) {
        fetch('/ingresos/eliminarEgreso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar egreso');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    $('#egresosTab').DataTable().destroy();
                    showAlert(successContainer, 'Egreso eliminado correctamente', 'alert-success');
                    llenarDatos();
                    llenarEgresos();
                }
            })
            .catch(error => {
                console.error('Error al eliminar egreso:', error);
                showError(errorContainer, 'No se pudo eliminar el egreso.');
            });
    }
}
function llenarDatos() {
    const filtro = $('#filtorEstadisticas').val();
    $('#estadisticasBody').empty();

    // Selección de datos según el filtro
    if (filtro === 'Mes') {
        const mes = parseInt($('#mes').val(), 10); // Asegura un parseo base 10
        const anio = parseInt($('#ano').val(), 10); // Asegura un parseo base 10
        
        // Validación básica en el cliente
        fetch('/ingresos/estadisticaMes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mes, anio }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener estadísticas del mes');
                }
                return response.json();
            })
            .then(data => {
                console.log('Estadísticas obtenidas (Mes):', data);
        
                // Validar estructura de los datos
                if (!data || !Array.isArray(data) || data.length === 0) {
                    $('#estadisticasBody').append('<tr><td colspan="2">No hay datos disponibles</td></tr>');
                    mostrarErrorEstadisticasMes();
                    console.warn('Datos inválidos o vacíos recibidos del servidor.');
                    return;
                }
        
                const etiquetas = data.map(item => `${item.tipo || 'Desconocido'} - ${formatearFecha(mes)}`);
                const ingresos = data.find(item => item.tipo === 'ingresos') || { total_mes: 0 };
                const egresos = data.find(item => item.tipo === 'egresos') || { total_mes: 0 };
        
                const datos = [
                    parseFloat(ingresos.total_mes) || 0,
                    parseFloat(egresos.total_mes) || 0,
                ];
        
                // Limpia el contenido existente en los contenedores
                $('#estadisticasBody').empty();
                $('#totalBodyE1').empty();
        
                // Crear filas de la tabla con los datos obtenidos
                data.forEach(item => {
                    const tipo = item.tipo || 'Desconocido';
                    const totalMes = formatoNumero(item.total_mes || 0);
        
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="celda-tipo">${tipo}</td>
                        <td class="celda-total">${totalMes}</td>
                    `;
                    $('#estadisticasBody').append(tr);
                });
        
                // Calcular el balance total
                const totalM = datos[0] - datos[1]; // ingresos.total_mes - egresos.total_mes
                const color =
                    totalM > 0 ? 'rgb(144, 238, 144)' :
                    totalM === 0 ? 'yellow' : 'red';
        
                $('#totalBodyE1').append(`
                    <tr>
                        <td style="background-color: ${color}; font-weight: bold;">${formatoNumero(totalM)}</td>
                    </tr>
                `);
        
                // Generar gráfico de barras para datos mensuales
                generarGrafico(datos, etiquetas, 'bar');
            })
            .catch(error => {
                console.error('Error al obtener estadísticas (Mes):', error);
            });
        

    } else if (filtro === 'Año') {
        const ano = $('#anoN').val(); // Obtener el año desde un campo de entrada

        fetch('/ingresos/estadisticaAno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ano }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener estadísticas del año');
                return response.json();
            })
            .then(data => {
                $('#estadisticas2Body').empty();
                $('#totalBodyE1').empty();
                if (data && Array.isArray(data) && data.length > 0) {
                    const etiquetas = [
                        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ];

                    const ingresos = data.find(item => item.tipo === 'ingreso');
                    const egresos = data.find(item => item.tipo === 'egreso');

                    const datosIngresos = etiquetas.map((_, index) => ingresos ? ingresos[etiquetas[index].toLowerCase()] || 0 : 0);
                    const datosEgresos = etiquetas.map((_, index) => egresos ? egresos[etiquetas[index].toLowerCase()] || 0 : 0);
                    var cont = 0;
                    var n = [];
                    var totalM;
                    // Crear filas de la tabla
                    data.forEach(item => {
                        const tr = document.createElement('tr');
                        var total = calcularTotal(item, false);
                        n.push(total);
                        tr.innerHTML = `
                            <td style="background:rgba(228,228,228,255);">${item.tipo}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.enero || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.febrero || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.marzo || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.abril || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.mayo || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.junio || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.julio || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.agosto || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.septiembre || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.octubre || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.noviembre || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(item.diciembre || 0)}</td>
                            <td style="background:rgba(228,228,228,255);">${formatoNumero(total || 0)}</td>
                            `;
                        if (total == 0) {
                            cont++
                        }
                        $('#estadisticas2Body').append(tr);
                    });
                    if (cont == 2) {
                        $('#estadisticas2Body').empty();
                        $('#estadisticas2Body').append('<tr><td colspan="14">No hay datos disponibles</td></tr>');
                        mostrarErrorEstadisticasAno();
                        cont = 0;
                        return

                    }
                    totalM = parseInt(n[0]) - parseInt(n[1]);
                    if (totalM > 0) {
                        $('#totalBodyE1').append(`<tr><td style="background-color: rgb(144, 238, 144) !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    } else if (totalM === 0) {
                        $('#totalBodyE1').append(`<tr><td style="background-color: yellow !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    } else {
                        $('#totalBodyE1').append(`<tr><td style="background-color: red !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    }

                    // Generar gráfico con los datos obtenidos
                    generarGrafico2([datosIngresos, datosEgresos], etiquetas, 'line');
                }

            })
            .catch(error => {
                console.error('Error al obtener estadísticas (Año):', error);
            });

    } else if (filtro === 'General') {
        fetch('/ingresos/estadisticageneral', { method: 'POST' }) // Cambié a POST para coincidir con el router
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener estadísticas generales');
                return response.json();
            })
            .then(data => {

                // Verifica si los datos son válidos
                if (data && Array.isArray(data) && data.length > 0) {
                    // Limpiar tabla antes de agregar nuevas filas
                    $('#estadisticasBody').empty();
                    $('#totalBodyE1').empty();

                    // Encontrar ingresos y egresos
                    const ingresos = data.find(item => item.tipo === 'ingresos');
                    const egresos = data.find(item => item.tipo === 'egresos');
                    var totalM;
                    // Datos para la tabla
                    data.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                    <td style="background:rgba(228,228,228,255);">${item.tipo || 'Desconocido'}</td>
                    <td style="background:rgba(228,228,228,255);">${formatoNumero(item.total_general || 0)}</td>
                `;
                        $('#estadisticasBody').append(tr);

                    });
                    totalM = parseInt(ingresos.total_general) - parseInt(egresos.total_general);
                    if (totalM > 0) {
                        $('#totalBodyE1').append(`<tr><td style="background-color: rgb(144, 238, 144) !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    } else if (totalM === 0) {
                        $('#totalBodyE1').append(`<tr><td style="background-color: yellow !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    } else {
                        $('#totalBodyE1').append(`<tr><td style="background-color: red !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    }



                    // Datos para el gráfico
                    const etiquetas = ['Ingresos', 'Egresos'];
                    const datos = [
                        ingresos ? ingresos.total_general : 0,
                        egresos ? egresos.total_general : 0
                    ];

                    // Generar gráfico de pastel
                    generarGrafico(datos, etiquetas, 'pie');
                } else {
                    console.warn('No se encontraron datos válidos.');
                    $('#estadisticasBody').append('<tr><td colspan="2">No hay datos disponibles</td></tr>');
                    mostrarErrorEstadisticasGeneral();
                }
            })
            .catch(error => {
                console.error('Error al obtener estadísticas (General):', error);

            });

    } else if (filtro === 'Decada') {
        const ano = $('#decada').val(); // Obtener el año desde un campo de entrada

        fetch('/ingresos/estadisticaDecada', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ano }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener estadísticas del año');
                return response.json();
            })
            .then(data => {
                $('#estadisticas3Body').empty();
                $('#estadisticas3Header').empty();
                $('#totalBodyE1').empty();
                const inicio = parseInt(ano);
                const etiquetas = Array.from({ length: 11 }, (_, i) => inicio + i); // Generar años de la década
                var totalM;
                const n = [];
                var cont = 0;
                // Generar encabezado dinámico de la tabla
                $('#estadisticas3Header').append(`<th scope="col">Tipo</th>`);
                etiquetas.forEach(anio => {
                    $('#estadisticas3Header').append(`<th scope="col">${anio}</th>`);
                });
                $('#estadisticas3Header').append(`<th scope="col">Total</th>`);

                if (data && Array.isArray(data) && data.length > 0) {
                    data.forEach(item => {
                        const tr = document.createElement('tr');
                        let total = 0;

                        // Construir fila dinámica
                        let contenido = `<td style="background:rgba(228,228,228,255);">${item.tipo || 'Desconocido'}</td>`;
                        etiquetas.forEach((_, index) => {
                            const valor = item[`a${index}`] || 0;
                            total += valor;
                            contenido += `<td style="background:rgba(228,228,228,255);">${formatoNumero(valor)}</td>`;
                        });
                        n.push(total);
                        if (total == 0) {
                            cont++
                        }
                        contenido += `<td style="background:rgba(228,228,228,255);">${formatoNumero(total)}</td>`;

                        tr.innerHTML = contenido;
                        $('#estadisticas3Body').append(tr);
                    });
                    if (cont == 2) {
                        $('#estadisticas3Body').empty();
                        $('#estadisticas3Header').empty();
                        $('#totalBodyE1').empty();
                        $('#estadisticas3Header').append(`<th scope="col">Tipo</th>`);
                        for (let i = 1; i <= 10; i++) {
                            $('#estadisticas3Header').append(`<th scope="col">${i}</th>`);

                        }
                        $('#totalBodyE1').append(`<tr><td style="background-color: yellow !important; font-weight: bold !important;">${formatoNumero(0)}</td></tr>`);
                        $('#estadisticas3Header').append(`<th scope="col">total</th>`);
                        $('#estadisticas3Body').append('<tr><td colspan="12">No hay datos disponibles</td></tr>');
                        mostrarErrorEstadisticasDecada()
                        return
                    }
                    // Obtener datos para gráficos
                    const ingresos = data.find(item => item.tipo === 'ingreso');
                    const egresos = data.find(item => item.tipo === 'egreso');

                    const datosIngresos = etiquetas.map((_, index) =>
                        ingresos ? ingresos[`a${index}`] || 0 : 0
                    );
                    const datosEgresos = etiquetas.map((_, index) =>
                        egresos ? egresos[`a${index}`] || 0 : 0
                    );
                    totalM = parseInt(n[0]) - parseInt(n[1]);
                    if (totalM > 0) {
                        $('#totalBodyE1').append(`<tr><td style="background-color: rgb(144, 238, 144) !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    } else if (totalM === 0) {
                        $('#totalBodyE1').append(`<tr><td style="background-color: yellow !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    } else {
                        $('#totalBodyE1').append(`<tr><td style="background-color: red !important; font-weight: bold !important;">${formatoNumero(totalM)}</td></tr>`);
                    }

                    generarGrafico2([datosIngresos, datosEgresos], etiquetas, 'line');
                } else {
                    $('#estadisticas3Header').append(`<th scope="col">Tipo</th>`);
                    $('#totalBodyE1').empty();
                    for (let i = 1; i <= 10; i++) {
                        $('#estadisticas3Header').append(`<th scope="col">${i}</th>`);

                    }
                    $('#estadisticas3Header').append(`<th scope="col">total</th>`);
                    $('#estadisticas3Body').append('<tr><td colspan="12">No hay datos disponibles</td></tr>');
                    mostrarErrorEstadisticasDecada()
                }
            })
            .catch(error => {
                console.error('Error al obtener estadísticas (Año):', error);
            });

    }

}
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
function formatearFecha(Mes) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const mes = meses[Mes - 1];
    return ` ${mes}`;
}
function generarGrafico2(datos, etiquetas, tipo) {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: tipo,
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Ingresos',
                    data: datos[0],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Egresos',
                    data: datos[1],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}
function calcularTotal(item, d) {
    if (d) {
        return item.a1 + item.a2 + item.a3 + item.a4 + item.a5 + item.a6 + item.a7 + item.a8 + item.a9 + item.a10;
    } else {
        return item.enero + item.febrero + item.marzo + item.abril + item.mayo + item.junio + item.julio + item.agosto + item.septiembre + item.octubre + item.noviembre + item.diciembre;
    }
}
function formatoNumero(numero) {
    let formato = numero.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: numero % 1 === 0 ? 0 : 2
    });
    return formato;
}
