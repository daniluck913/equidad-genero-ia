let catalogData = []; // Variable para almacenar los datos cargados

// Función para cargar el archivo Excel
async function loadExcelFile() {
    const response = await fetch('data.xlsx'); // Archivo en el mismo directorio
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[1]; // Primera hoja
    catalogData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    renderCatalog(catalogData);
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
                        <button class="btn btn-primary" onclick="showDetails(${index})">Ver más</button>
                    </div>
                </div>
            </div>
        `;
        catalogContainer.innerHTML += card;
    });
}

// Mostrar detalles en el modal
function showDetails(index) {
    const item = catalogData[index];
    console.log(item);
    document.getElementById('modalTitle').innerText = item['Herramienta'];
    document.getElementById('modalDescription').innerText = item['Descripción'];
    document.getElementById('modalCreator').innerText = item['Creador'];
    document.getElementById('modalLicense').innerText = item['Licencia'];
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
        (item['Creador'] && item['Creador'].toLowerCase().includes(searchTerm))
    );
    renderCatalog(filteredData);
});

// Cargar el archivo Excel al cargar la página
window.onload = loadExcelFile;