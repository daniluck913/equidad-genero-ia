let catalogData = []; // Variable para almacenar los datos cargados

// Función para cargar el archivo Excel
async function loadExcelFile() {
    try {
        const response = await fetch('data/data.xlsx'); // Asegúrate de que el archivo esté en la ubicación correcta
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Especificar la hoja "Catálogo de herramientas"
        const sheetName = "Catálogo de herramientas";
        if (!workbook.SheetNames.includes(sheetName)) {
            throw new Error(`La hoja "${sheetName}" no existe en el archivo Excel.`);
        }

        catalogData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        renderCatalog(catalogData);
        initializeFilters(catalogData);
    } catch (error) {
        console.error('Error al cargar el archivo Excel:', error);
    }
}

// Función para renderizar el catálogo
function renderCatalog(data, sortBy = 'name') {
    const sortedData = [...data].sort((a, b) => {
        if (sortBy === 'importance') {
            const importanceA = Number(a['Importancia'] || 0);
            const importanceB = Number(b['Importancia'] || 0);
            if (importanceB !== importanceA) return importanceB - importanceA;
            return (a['Herramienta'] || '').localeCompare(b['Herramienta'] || '');
        } else {
            return (a['Herramienta'] || '').localeCompare(b['Herramienta'] || '');
        }
    });

    const catalogContainer = document.getElementById('catalogo');
    catalogContainer.innerHTML = ''; // Limpiar contenido previo

    sortedData.forEach((item) => {
        const year = item['Año'] ? item['Año'] : 'Año no especificado';
        const card = `
            <div class="col-md-4 my-3 catalog-item">
                <div class="card h-100">
                    <img src="${item['URL Imagen']}" class="card-img-top" alt="${item['Herramienta']}">
                    <div class="card-body">
                        <h5 class="card-title">${item['Herramienta']}</h5>
                        <p class="card-text">${item['Descripción']}</p>
                        <p>
                            <strong>Creador:</strong> ${item['Creador']} 
                            <span class="badge bg-dark">${year}</span>
                            ${item['Importancia'] ? generateStars(item['Importancia']) : ''}
                        </p>
                        <p><strong>Licencia:</strong> ${item['Licencia']}</p>
                        <button class="btn btn-primary" onclick="showDetails('${item['Herramienta']}')">Ver más</button>
                    </div>
                </div>
            </div>
        `;
        catalogContainer.innerHTML += card;
    });
}

// Función para generar estrellas de acuerdo con la importancia
function generateStars(importance) {
    const maxStars = 5;
    const filledStars = Math.min(importance, maxStars);
    let starsHTML = '';

    for (let i = 1; i <= maxStars; i++) {
        if (i <= filledStars) {
            starsHTML += '<i class="fa fa-star text-warning"></i>'; // Estrella llena
        } else {
            starsHTML += '<i class="fa fa-star text-secondary"></i>'; // Estrella vacía
        }
    }
    return `<div class="star-rating">${starsHTML}</div>`;
}

function initializeFilters(data) {
    const uniqueActors = getUniqueOptions(data, 'Actor');
    const uniquePhases = getUniqueOptions(data, 'Fase del CV');
    const uniqueObjectives = getUniqueOptions(data, 'Objetivo');
    const uniqueToolTypes = getUniqueOptions(data, 'Tipo de herramienta');

    populateSelect('#filterActor', uniqueActors);
    populateSelect('#filterPhase', uniquePhases);
    populateSelect('#filterObjective', uniqueObjectives);
    populateSelect('#filterToolType', uniqueToolTypes);

    $('#filterActor').select2({
        placeholder: "Selecciona público objetivo",
        allowClear: true,
        width: '100%'
    });

    $('#filterPhase').select2({
        placeholder: "Selecciona una o más fases",
        allowClear: true,
        width: '100%'
    });

    $('#filterObjective').select2({
        placeholder: "Selecciona uno o más objetivos",
        allowClear: true,
        width: '100%'
    });

    $('#filterToolType').select2({
        placeholder: "Selecciona uno o más tipos de herramientas",
        allowClear: true,
        width: '100%'
    });

    document.getElementById('sortTools').addEventListener('change', function() {
        const sortBy = this.value;

        const selectedActors = $('#filterActor').val() || [];
        const selectedPhases = $('#filterPhase').val() || [];
        const selectedObjectives = $('#filterObjective').val() || [];
        const selectedToolTypes = $('#filterToolType').val() || [];

        const filteredData = catalogData.filter(item => {
            const matchesActor = matchesFilter(item['Actor'], selectedActors);
            const matchesPhase = matchesFilter(item['Fase del CV'], selectedPhases);
            const matchesObjective = matchesFilter(item['Objetivo'], selectedObjectives);
            const matchesToolType = matchesFilter(item['Tipo de herramienta'], selectedToolTypes);
            return matchesActor && matchesPhase && matchesObjective && matchesToolType;
        });

        renderCatalog(filteredData, sortBy);
    });

    $('.form-select').on('change', filterCatalog);
}

function getUniqueOptions(data, columnName) {
    const options = data.flatMap(item => {
        return item[columnName] ? item[columnName].split(';').map(opt => opt.trim()) : [];
    });
    return [...new Set(options)];
}

function populateSelect(selector, items) {
    const select = document.querySelector(selector);
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

function filterCatalog() {
    const selectedActors = $('#filterActor').val() || [];
    const selectedPhases = $('#filterPhase').val() || [];
    const selectedObjectives = $('#filterObjective').val() || [];
    const selectedToolTypes = $('#filterToolType').val() || [];
    const sortBy = document.getElementById('sortTools').value;

    const filteredData = catalogData.filter(item => {
        const matchesActor = matchesFilter(item['Actor'], selectedActors);
        const matchesPhase = matchesFilter(item['Fase del CV'], selectedPhases);
        const matchesObjective = matchesFilter(item['Objetivo'], selectedObjectives);
        const matchesToolType = matchesFilter(item['Tipo de herramienta'], selectedToolTypes);
        return matchesActor && matchesPhase && matchesObjective && matchesToolType;
    });

    renderCatalog(filteredData, sortBy);
}

function matchesFilter(itemValue, selectedOptions) {
    if (!itemValue) return selectedOptions.length === 0;
    const itemOptions = itemValue.split(';').map(opt => opt.trim());
    return selectedOptions.length === 0 || selectedOptions.some(option => itemOptions.includes(option));
}

function showDetails(toolName) {
    // Buscar la herramienta correspondiente por su nombre
    const item = catalogData.find(data => data['Herramienta'] === toolName);
    if (!item) {
        console.error('Herramienta no encontrada');
        return;
    }

    // Función auxiliar para formatear texto (reemplaza punto y coma con comas)
    const formatText = (text) => text ? text.replace(/;/g, ',') : 'N/A';

    // Asignar valores a los elementos del modal
    document.getElementById('modalImage').src = item['URL Imagen'] || 'https://via.placeholder.com/150';
    document.getElementById('modalImage').alt = `Imagen de ${item['Herramienta']}`;
    document.getElementById('modalTitle').innerText = item['Herramienta'] || 'Título no disponible';
    document.getElementById('modalDescription').innerText = item['Descripción'] || 'Descripción no disponible';
    document.getElementById('modalCreator').innerText = item['Creador'] || 'No especificado';
    document.getElementById('modalYear').innerText = item['Año'] || 'No especificado';
    document.getElementById('modalLicense').innerText = item['Licencia'] || 'No especificada';
    document.getElementById('modalActor').innerText = formatText(item['Actor']);
    document.getElementById('modalPhase').innerText = formatText(item['Fase del CV']);
    document.getElementById('modalObjective').innerText = formatText(item['Objetivo']);
    document.getElementById('modalToolType').innerText = item['Tipo de herramienta'] || 'No especificada';

    // Configurar la URL del botón
    const modalURL = document.getElementById('modalURL');
    if (item['URL']) {
        modalURL.href = item['URL'];
        modalURL.style.display = 'inline-block'; // Mostrar el botón si hay URL
    } else {
        modalURL.href = '#';
        modalURL.style.display = 'none'; // Ocultar el botón si no hay URL
    }

    // Mostrar el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
}


document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredData = catalogData.filter(item =>
        Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm)
        )
    );
    renderCatalog(filteredData);
});

window.onload = loadExcelFile;
