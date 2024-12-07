var socios = [];
var errorContainer;
var successContainer;
var dataTable;

document.addEventListener('DOMContentLoaded', function () {
    if ($(window).width() < 768) {
        // Ajustes adicionales para pantallas pequeñas
        $('.nav-link').addClass('text-center');
    }
    const navbar = document.querySelector('.navbar');
    successContainer = document.getElementById('successContainer');
    errorContainer = document.getElementById('errorContainer');
    $('#btnAgregar').on('click', function() {
        $('#btnCerrarModal').click();
    });
 
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

    // Llenar la lista de socios al cargar la página
    llenarSocios();
    document.getElementById('estado').addEventListener('change', function () {
        const selectedEstado = this.value === 'todo' ? '' : this.value;
        const table = $('#tabSocios').DataTable();
        table.column(8).search(selectedEstado).draw();
    });
    // Configurar el botón para agregar nuevo socio
    $('#btnAgregarSocio').on('click', function() {
        if (socios && socios.length > 0) {
            const id = socios[socios.length - 1].id.split('#');
            const newId = `${id[0]}#${parseInt(id[1]) + 1}`;
            $('#id').val(newId);
        } else {
            $('#id').val('AmiiSoc#1');
        }
    });

    // Configurar el envío del formulario de socio
    $('#formSocio').on('submit', function(event) {
        event.preventDefault();

        const id = $('#id').val();
        const nombre = $('#nombre').val();
        const apelllidos = $('#apellido').val();
        const fechaNacimiento = $('#fechaNacimiento').val();
        const fechaInscripcion = $('#fechaInscripcion').val();
        const email = $('#email').val();
        const telefono = $('#telefono').val();
        const seccion = $('#seccion').val();
        fetch('/socios/agregarSocio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                nombre,
                apelllidos,
                fechaNacimiento,
                fechaInscripcion,
                email,
                telefono,
                seccion
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar socio');
            }
            return response.json();
        })
        .then(data => {
          if (data.success) { 
            console.log('Socio agregado:', data);
            showAlert(successContainer, 'Socio agregado correctamente', 'alert-success');
            $('#tabSocios').DataTable().destroy();
            llenarSocios(); // Actualizar la lista de socios
          }else{
            showError(errorContainer, 'No se pudo agregar el socio.');
          }
        })
        .catch(error => {
            console.error('Error al agregar socio:', error);
            showError(errorContainer, 'No se pudo agregar el socio.');
        });
    });
});

// Función para obtener y mostrar la lista de socios
function llenarSocios() {
    fetch('/socios/getSociosConEstado')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener socios');
        }
        return response.json();
    })
    .then(data => {
        socios = data;
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
                    <td>${socio.email||'N/A'}</td>
                    <td>${socio.telefono||'N/A'}</td>
                    <td>${socio.seccion}</td>
                    <td id="estadoSocio${i}">${socio.estado || 'N/A'}</td>
                    <td>
                        <div class="d-flex align-items-center justify-content-between">
                            <button onclick="eliminarSocio('${socio.id}')" style="border: none; background-color: rgba(255, 255, 255, 0.374);"><i class="bi bi-trash" style="color:red;"></i></button>
                            <button onclick="detalles('${socio.id}')" style="border: none; background-color: rgba(255, 255, 255, 0.374);"><i class="bi bi-arrow-right" style="color: green;"></i></button>
                        </div>
                    </td>
                `;
                $('#sociosBody').append(tr);
                if(socio.estado=='pagado'){
                    $('#estadoSocio'+i).html('<span class="badge bg-success">Pagado</span>');
                }else if(socio.estado=='pendiente'){
                    $('#estadoSocio'+i).html('<span class="badge bg-danger">Pendiente</span>');
                }
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
            cell.setAttribute('colspan', '10');
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
function detalles(id) {
    const errorContainer = document.getElementById('errorContainer'); // Asegúrate de que el elemento exista en el DOM

    fetch('/socios/detalles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener socios');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            window.location.href = '/socios/redirect';
        }
    })
    .catch(error => {
        console.error('Error al obtener socios:', error);
        if (typeof showError === 'function' && errorContainer) {
            showError(errorContainer, 'No se pudo obtener la lista de socios.');
        } else {
            console.warn('showError o errorContainer no están definidos');
        }
    });
}

// Función para eliminar socio
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
                showAlert(successContainer, 'Socio eliminado correctamente', 'alert-success');
                llenarSocios();
            }
        })
        .catch(error => {
            console.error('Error al eliminar socio:', error);
            showError(errorContainer, 'No se pudo eliminar el socio.');
        });
    }
};

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
