document.addEventListener('DOMContentLoaded', function () {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            updateHeader(); // Actualizar el título de la página
        })
        .catch(error => console.error('Error al cargar el encabezado:', error));
});

function updateHeader() {
    const pageTitle = document.title || 'Página sin título';
    document.getElementById('page-title').textContent = pageTitle;
}
