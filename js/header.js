// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Cargar el encabezado desde header.html
    loadComponent('header.html', 'afterbegin', () => {
        updateHeader(); // Actualizar dinámicamente el título de la página en el encabezado
    });

    // Cargar el pie de página desde footer.html
    loadComponent('footer.html', 'beforeend');
});

/**
 * Carga un componente HTML en el DOM.
 * 
 * @param {string} filePath - Ruta del archivo HTML a cargar.
 * @param {string} position - Posición en la que se insertará el contenido: 
 *                            'afterbegin' para el inicio del <body>,
 *                            'beforeend' para el final del <body>.
 * @param {function} [callback] - Función opcional que se ejecuta después de insertar el contenido.
 */
function loadComponent(filePath, position, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar ${filePath}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML(position, data);
            if (typeof callback === 'function') {
                callback(); // Ejecutar callback si se proporciona
            }
        })
        .catch(error => console.error(`Error al cargar el componente desde ${filePath}:`, error));
}

/**
 * Actualiza dinámicamente el título del encabezado con el título actual de la página.
 */
function updateHeader() {
    const pageTitle = document.title || 'Página sin título';
    const pageTitleElement = document.getElementById('page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = pageTitle;
    } else {
        console.warn('Elemento con ID "page-title" no encontrado en el encabezado.');
    }
}
