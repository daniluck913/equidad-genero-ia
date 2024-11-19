let guiaData = []; // Variable para almacenar los datos cargados

// Función principal que inicia cuando el documento está listo
document.addEventListener('DOMContentLoaded', function () {
    // Cargar datos desde el archivo Excel
    loadExcelFile();

    // Asociar eventos
    setupEventListeners();
});

// Función para cargar el archivo Excel
async function loadExcelFile() {
    try {
        const response = await fetch('data.xlsx'); // Archivo en el mismo directorio
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Verificar si la hoja existe
        const sheetName = "Guía"; // Nombre exacto de la hoja
        if (!workbook.SheetNames.includes(sheetName)) {
            throw new Error(`La hoja "${sheetName}" no existe en el archivo Excel.`);
        }

        // Convertir la hoja a JSON y renderizar
        guiaData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        renderGuia(guiaData);
    } catch (error) {
        console.error('Error al cargar la guía:', error);
        alert('No se pudo cargar la guía. Verifique la conexión, el archivo o el nombre de la hoja.');
    }
}

// Función para asociar los eventos
function setupEventListeners() {
    // Evento para alternar entre Desarrollo y Adopción
    document.getElementById('toggleViewBtn').addEventListener('click', toggleView);

    // Evento para el filtro de búsqueda
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const filteredData = guiaData.filter(item =>
            (item['Descripción'] && item['Descripción'].toLowerCase().includes(searchTerm)) ||
            (item['Fase'] && item['Fase'].toLowerCase().includes(searchTerm)) ||
            (item['Propósito'] && item['Propósito'].toLowerCase().includes(searchTerm))
        );
        renderGuia(filteredData);
    });
}

// Renderizar las buenas prácticas según el propósito
function renderGuia(data) {
    const desarrolloContainer = document.getElementById('desarrollo');
    const adopcionContainer = document.getElementById('adopcion');

    // Limpiar contenido previo
    desarrolloContainer.innerHTML = '';
    adopcionContainer.innerHTML = '';

    // Ordenar las buenas prácticas por el campo 'ID'
    const sortedData = data.sort((a, b) => {
        const idA = (a['ID'] || '').toUpperCase();
        const idB = (b['ID'] || '').toUpperCase();
        return idA.localeCompare(idB, undefined, { numeric: true });
    });

    // Renderizar las tarjetas en el contenedor correspondiente
    sortedData.forEach((item, index) => {
        const proposito = (item['Propósito'] || '').trim().toLowerCase();

        const card = `
            <div class="col">
                <div class="card h-100">
                    <img src="${item['Imagen'] || 'placeholder.png'}" class="card-img-top" alt="${item['ID']}">
                    <div class="card-body">
                        <h5 class="card-title" id="title-${index}">${item['ID'] || 'Sin Título'}</h5>
                        <p class="card-text" id="content-${index}">${item['Descripción'] || 'Sin Descripción'}</p>
                        <button class="btn btn-secondary mt-3" id="toggle-btn-${index}" onclick="toggleContent(${index})">Ejemplo</button>
                        <button class="btn btn-primary mt-3" onclick="showDetails(${index})">Ver más</button>
                    </div>
                </div>
            </div>
        `;

        // Clasificar según el propósito
        if (proposito === 'desarrollo') {
            desarrolloContainer.innerHTML += card;
        } else if (proposito === 'adopción') {
            adopcionContainer.innerHTML += card;
        } else {
            console.warn(`Propósito desconocido: "${proposito}" en la fila ${index + 1}`);
        }
    });

    // Mostrar mensaje si las secciones están vacías
    if (!desarrolloContainer.innerHTML) {
        desarrolloContainer.innerHTML = '<p>No se encontraron buenas prácticas de Desarrollo.</p>';
    }
    if (!adopcionContainer.innerHTML) {
        adopcionContainer.innerHTML = '<p>No se encontraron buenas prácticas de Adopción.</p>';
    }
}


// Alternar contenido entre Descripción y Ejemplo
function toggleContent(index) {
    const cardElement = document.querySelector(`#content-${index}`).closest('.card');
    const contentElement = document.getElementById(`content-${index}`);
    const titleElement = document.getElementById(`title-${index}`);
    const toggleButton = document.getElementById(`toggle-btn-${index}`);
    const item = guiaData[index];

    // Agregar animación
    cardElement.classList.add('alternate');
    contentElement.classList.add('hidden');

    setTimeout(() => {
        if (contentElement.innerText === item['Descripción']) {
            contentElement.innerText = item['Ejemplo de aplicación'] || 'Sin Ejemplo';
            titleElement.innerText = 'Ejemplo';
            toggleButton.innerText = 'Buena práctica';
        } else {
            contentElement.innerText = item['Descripción'];
            titleElement.innerText = item['ID'];
            toggleButton.innerText = 'Ejemplo';
        }

        // Eliminar animación después de actualizar
        contentElement.classList.remove('hidden');
        setTimeout(() => cardElement.classList.remove('alternate'), 300);
    }, 300); // Duración de la animación
}

// Mostrar detalles en el modal
function showDetails(index) {
    const item = guiaData[index];
    document.getElementById('modalTitle').innerText = item['ID'];
    document.getElementById('modalDescription').innerText = item['Descripción'];
    document.getElementById('modalPhase').innerText = item['Fase'];
    document.getElementById('modalPurpose').innerText = item['Propósito'];
    document.getElementById('modalExample').innerText = item['Ejemplo de aplicación'];
    document.getElementById('modalObjective').innerText = item['Objetivo'];
    document.getElementById('modalImage').src = item['Imagen'] || 'placeholder.png';
    new bootstrap.Modal(document.getElementById('infoModal')).show();
}

// Alternar entre Desarrollo y Adopción
function toggleView() {
    const desarrolloContainer = document.getElementById('desarrollo');
    const adopcionContainer = document.getElementById('adopcion');
    const desarrolloTitle = document.getElementById('desarrollo-title');
    const adopcionTitle = document.getElementById('adopcion-title');
    const toggleBtn = document.getElementById('toggleViewBtn');

    if (desarrolloContainer.classList.contains('d-none')) {
        adopcionContainer.classList.add('d-none');
        adopcionTitle.classList.add('d-none');
        desarrolloContainer.classList.remove('d-none');
        desarrolloTitle.classList.remove('d-none');
        toggleBtn.innerText = 'Mostrar Adopción';
    } else {
        desarrolloContainer.classList.add('d-none');
        desarrolloTitle.classList.add('d-none');
        adopcionContainer.classList.remove('d-none');
        adopcionTitle.classList.remove('d-none');
        toggleBtn.innerText = 'Mostrar Desarrollo';
    }
}
