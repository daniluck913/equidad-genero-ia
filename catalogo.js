let catalogData = []; // Variable para almacenar los datos cargados

// Función para cargar el archivo Excel
async function loadExcelFile() {
    const response = await fetch('data.xlsx'); // Archivo en el mismo directorio
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[1]; // Primera hoja
    catalogData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    renderCatalog(catalogData);
    initializeFilters(catalogData);
}

// Renderizar el catálogo
function renderCatalog(data) {
    const catalogContainer = document.getElementById('catalogo');
    catalogContainer.innerHTML = ''; // Limpiar contenido previo
    data.forEach((item, index) => {
        const card = `
            <div class="col-md-4 my-3 catalog-item">
                <div class="card h-100">
                    <img src="${item['URL Imagen']}" class="card-img-top" alt="${item['Herramienta']}">
                    <div class="card-body">
                        <h5 class="card-title">${item['Herramienta']}</h5>
                        <p class="card-text">${item['Descripción']}</p>
                        <p><strong>Creador:</strong> ${item['Creador']}</p>
                        <p><strong>Licencia:</strong> ${item['Licencia']}</p>
                        <button class="btn btn-primary" onclick="showDetails('${item['Herramienta']}')">Ver más</button>
                    </div>
                </div>
            </div>
        `;
        catalogContainer.innerHTML += card;
    });
}

function initializeFilters(data) {
    // Extraer valores únicos para cada categoría dividiendo por comas y filtrando
    const uniqueActors = getUniqueOptions(data, 'Actor');
    const uniquePhases = getUniqueOptions(data, 'Fase del CV');
    const uniqueObjectives = getUniqueOptions(data, 'Objetivo');
    const uniqueToolTypes = getUniqueOptions(data, 'Tipo de herramienta');

    // Llenar las opciones de los filtros
    populateSelect('#filterActor', uniqueActors);
    populateSelect('#filterPhase', uniquePhases);
    populateSelect('#filterObjective', uniqueObjectives);
    populateSelect('#filterToolType', uniqueToolTypes);

    // Inicializar Select2 con diferentes placeholders
    $('#filterActor').select2({
        placeholder: "Selecciona uno o más actores",
        allowClear: true,
        width: '100%' // Asegura que ocupe todo el contenedor
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

    // Escuchar cambios en los filtros
    $('.form-select').on('change', filterCatalog);
}

// Función para obtener opciones únicas
function getUniqueOptions(data, columnName) {
    const options = data.flatMap(item => {
        if (item[columnName]) {
            return item[columnName].split(';').map(opt => opt.trim()).filter(opt => /^[A-Z]/.test(opt));
        }
        return [];
    });
    return [...new Set(options)];
}

// Función para llenar los select con opciones
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
    // Obtener valores seleccionados de cada filtro
    const selectedActors = $('#filterActor').val() || [];
    const selectedPhases = $('#filterPhase').val() || [];
    const selectedObjectives = $('#filterObjective').val() || [];
    const selectedToolTypes = $('#filterToolType').val() || [];

    // Filtrar los datos
    const filteredData = catalogData.filter(item => {
        const matchesActor = matchesFilter(item['Actor'], selectedActors);
        const matchesPhase = matchesFilter(item['Fase del CV'], selectedPhases);
        const matchesObjective = matchesFilter(item['Objetivo'], selectedObjectives);
        const matchesToolType = matchesFilter(item['Tipo de herramienta'], selectedToolTypes);
        return matchesActor && matchesPhase && matchesObjective && matchesToolType;
    });

    // Renderizar los resultados filtrados
    renderCatalog(filteredData);
}

// Comprobar si un elemento coincide con los filtros seleccionados
function matchesFilter(itemValue, selectedOptions) {
    if (!itemValue) return selectedOptions.length === 0;
    const itemOptions = itemValue.split(';').map(opt => opt.trim());
    return selectedOptions.length === 0 || selectedOptions.some(option => itemOptions.includes(option));
}

// Mostrar detalles en el modal
function showDetails(toolName) {
    const item = catalogData.find(data => data['Herramienta'] === toolName);
    if (!item) {
        console.error('Herramienta no encontrada');
        return;
    }

    document.getElementById('modalTitle').innerText = item['Herramienta'];
    document.getElementById('modalDescription').innerText = item['Descripción'];
    document.getElementById('modalCreator').innerText = item['Creador'];
    document.getElementById('modalLicense').innerText = item['Licencia'];
    document.getElementById('modalActor').textContent = item['Actor'];
    document.getElementById('modalPhase').textContent = item['Fase del CV'];
    document.getElementById('modalObjective').textContent = item['Objetivo'];
    document.getElementById('modalToolType').textContent = item['Tipo de herramienta'];
    document.getElementById('modalImage').src = item['URL Imagen'];
    document.getElementById('modalURL').href = item['URL'];

    new bootstrap.Modal(document.getElementById('infoModal')).show();
}

// Filtrar el catálogo
document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredData = catalogData.filter(item =>
        (item['Herramienta'] && item['Herramienta'].toLowerCase().includes(searchTerm)) ||
        (item['Descripción'] && item['Descripción'].toLowerCase().includes(searchTerm)) ||
        (item['Creador'] && item['Creador'].toLowerCase().includes(searchTerm)) ||
        (item['Actor'] && item['Actor'].toLowerCase().includes(searchTerm)) ||
        (item['Fase del CV'] && item['Fase del CV'].toLowerCase().includes(searchTerm)) ||
        (item['Objetivo'] && item['Objetivo'].toLowerCase().includes(searchTerm)) ||
        (item['Tipo de herramienta'] && item['Tipo de herramienta'].toLowerCase().includes(searchTerm))
    );
    renderCatalog(filteredData);
});


// Cargar el archivo Excel al cargar la página
window.onload = loadExcelFile;

