// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Cargar el encabezado
        await loadComponent('header.html', 'afterbegin');
        updateHeader(); // Actualizar dinámicamente el título en el encabezado

        // Cargar el pie de página
        await loadComponent('footer.html', 'beforeend');

        // Delegar evento para botones de cierre
        setupCloseButton();

    } catch (error) {
        console.error('Error al inicializar la página:', error);
    }
});

/**
 * Carga un componente HTML en el DOM usando async/await.
 * @param {string} filePath - Ruta del archivo HTML a cargar.
 * @param {string} position - Posición para insertar el contenido ('afterbegin' o 'beforeend').
 * @returns {Promise<void>}
 */
async function loadComponent(filePath, position) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error al cargar ${filePath}: ${response.statusText}`);
        }
        const data = await response.text();
        document.body.insertAdjacentHTML(position, data);
    } catch (error) {
        console.error(`Error al cargar el componente desde ${filePath}:`, error);
    }
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

/**
 * Configura un evento delegado para los botones de cierre.
 * Utiliza event delegation para eliminar la sección completa con ID "tool-purpose".
 */
function setupCloseButton() {
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('close-button')) {
            const section = document.getElementById('tool-purpose');
            if (section) {
                section.remove(); // Elimina completamente el elemento del DOM
            } else {
                console.warn('Elemento con ID "tool-purpose" no encontrado.');
            }
        }
    });
}
