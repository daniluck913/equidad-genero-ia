document.addEventListener('DOMContentLoaded', function () {
    // Cargar el archivo Excel
    loadExcelFile();

    // Asociar eventos y configurar Select2
    setupEventListeners();
});

let guiaData = []; // Datos de la guía cargados desde el Excel

// Función para cargar el archivo Excel
async function loadExcelFile() {
    try {
        const response = await fetch('data/data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // Verificar si la hoja existe
        const sheetName = "Guía";
        if (!workbook.SheetNames.includes(sheetName)) {
            throw new Error(`La hoja "${sheetName}" no existe en el archivo Excel.`);
        }

        // Convertir la hoja a JSON
        guiaData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Cargar opciones únicas para el filtro de fases
        const fasesUnicas = [...new Set(guiaData.map(item => item['Fase'] || '').filter(fase => fase))];
        const phaseSelect = document.getElementById('phaseSelect');

        fasesUnicas.forEach(fase => {
            const option = document.createElement('option');
            option.value = fase;
            option.textContent = fase;
            phaseSelect.appendChild(option);
        });

        // Renderizar las tarjetas iniciales
        renderGuia(guiaData);
    } catch (error) {
        console.error('Error al cargar la guía:', error);
        alert('No se pudo cargar la guía. Verifique el archivo Excel y su contenido.');
    }
}

// Configurar los eventos y Select2
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = $('#filterSelect2'); // Select2 para objetivos
    const phaseSelect = $('#phaseSelect');   // Select2 para fases

    // Inicializar Select2
    filterSelect.select2({
        placeholder: "Seleccione uno o más objetivos",
        allowClear: true,
        width: 'resolve'
    });

    phaseSelect.select2({
        placeholder: "Seleccione una o más fases",
        allowClear: true,
        width: 'resolve'
    });

    // Escucha cambios en el filtro de búsqueda
    searchInput.addEventListener('input', applyFilters);

    // Escucha cambios en los filtros múltiples
    filterSelect.on('change', applyFilters);
    phaseSelect.on('change', applyFilters);
}

// Aplicar filtros de búsqueda, objetivos y fases
function applyFilters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedObjectives = $('#filterSelect2').val(); // Valores seleccionados de objetivos
    const selectedPhases = $('#phaseSelect').val();       // Valores seleccionados de fases

    // Filtra los datos
    const filteredData = guiaData.filter(item => {
        // Comprobar búsqueda
        const matchesSearch = Object.values(item).some(value =>
            value && value.toString().toLowerCase().includes(searchInput)
        );

        // Comprobar filtro múltiple contra la columna "Objetivo"
        const objetivos = (item['Objetivo'] || '').split(',').map(obj => obj.trim());
        const matchesObjectives = selectedObjectives.length === 0 || selectedObjectives.some(option => objetivos.includes(option));

        // Comprobar filtro múltiple contra la columna "Fase"
        const fase = item['Fase'] || '';
        const matchesPhases = selectedPhases.length === 0 || selectedPhases.includes(fase);

        // Combina todos los criterios
        return matchesSearch && matchesObjectives && matchesPhases;
    });

    renderGuia(filteredData);
}

// Función para renderizar las tarjetas
function renderGuia(data) {
    const desarrolloContainer = document.getElementById('desarrollo');
    const adopcionContainer = document.getElementById('adopcion');

    desarrolloContainer.innerHTML = '';
    adopcionContainer.innerHTML = '';

    data.forEach((item, index) => {
        const proposito = (item['Propósito'] || '').trim().toLowerCase();
        const fase = item['Fase'] || 'Sin fase';
        const objetivo = item['Objetivo'] || 'Sin objetivo';

        const objetivosBadges = objetivo
            .split(',')
            .map(obj => `<span class="badge bg-success text-white">${obj.trim()}</span>`)
            .join(' ');

        const card = `
            <div class="col">
                <div class="card h-100 d-flex flex-column">
                    <div class="card-header">
                        <h5 class="mb-0">${fase}</h5>
                    </div>
                    <div class="card-body flex-grow-1">
                        <h5 class="card-title">Buena práctica</h5>
                        <p class="card-text">${item['Descripción'] || 'Sin Descripción'}</p>
                        <div class="mt-2">${objetivosBadges}</div>
                    </div>
                    <div class="card-footer text-end">
                        <button class="btn btn-primary" onclick="showDetails(${index})">Ver más</button>
                    </div>
                </div>
            </div>
        `;

        if (proposito === 'desarrollo') {
            desarrolloContainer.innerHTML += card;
        } else if (proposito === 'adopción') {
            adopcionContainer.innerHTML += card;
        }
    });

    if (!desarrolloContainer.innerHTML) {
        desarrolloContainer.innerHTML = '<p>No se encontraron buenas prácticas de Desarrollo.</p>';
    }
    if (!adopcionContainer.innerHTML) {
        adopcionContainer.innerHTML = '<p>No se encontraron buenas prácticas de Adopción.</p>';
    }

    // Mostrar la cantidad de resultados en la consola
    console.log(`Resultados encontrados: ${data.length}`);
}

// Mostrar detalles de una tarjeta en el modal
function showDetails(index) {
    // Obtener el elemento correspondiente del array de datos
    const item = guiaData[index];

    // Verificar si el elemento existe antes de intentar mostrar los datos
    if (!item) {
        console.error(`No se encontró el elemento en el índice ${index}`);
        return;
    }

    // Asignar los valores al modal
    document.getElementById('modalDescription').textContent = item['Descripción'] || 'Sin Descripción';
    document.getElementById('modalPhase').textContent = item['Fase'] || 'Sin Fase';
    document.getElementById('modalPurpose').textContent = item['Propósito'] || 'Sin Propósito';
    document.getElementById('modalExample').textContent = item['Ejemplo de aplicación'] || 'Sin Ejemplo';
    document.getElementById('modalObjective').textContent = item['Objetivo'] || 'Sin Objetivo';

    // Mostrar el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
}
// Mostrar detalles de una tarjeta en el modal
function showDetails(index) {
    // Obtener el elemento correspondiente del array de datos
    const item = guiaData[index];

    // Verificar si el elemento existe antes de intentar mostrar los datos
    if (!item) {
        console.error(`No se encontró el elemento en el índice ${index}`);
        return;
    }

    // Asignar los valores al modal
    document.getElementById('modalDescription').textContent = item['Descripción'] || 'Sin Descripción';
    document.getElementById('modalPhase').textContent = item['Fase'] || 'Sin Fase';
    document.getElementById('modalPurpose').textContent = item['Propósito'] || 'Sin Propósito';
    document.getElementById('modalExample').textContent = item['Ejemplo de aplicación'] || 'Sin Ejemplo';
    document.getElementById('modalObjective').textContent = item['Objetivo'] || 'Sin Objetivo';

    // Manejar el botón de fuente del ejemplo
    const modalLink = document.getElementById('modalLink');
    if (item['Enlace']) {
        modalLink.href = item['Enlace'];
        modalLink.style.display = 'inline-block'; // Mostrar el botón
    } else {
        modalLink.style.display = 'none'; // Ocultar si no hay enlace
    }

    // Mostrar el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
}
