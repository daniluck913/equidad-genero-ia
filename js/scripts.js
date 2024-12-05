document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const contentContainer = document.getElementById('content-container');

    // Lógica para mostrar/ocultar el menú lateral
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        contentContainer.classList.toggle('active');
    });

    // Lógica para cargar contenido dinámico
    document.querySelectorAll('#sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function () {
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Función para cargar páginas dinámicamente
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la página');
                }
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
            })
            .catch(error => {
                contentContainer.innerHTML = `<div class="alert alert-danger" role="alert">
                    No se pudo cargar el contenido: ${error.message}
                </div>`;
            });
    }
});
