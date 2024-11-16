document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada, inicializando...');
  initializeApp();
});

// Función principal para inicializar la aplicación
function initializeApp() {
  bindSelectionEvents(); // Vincula los eventos para seleccionar el tipo de acción
}

// Variables globales
let steps = [];
let currentStepIndex = 0;
let selectedPurpose = ""; // Propósito seleccionado (Desarrollar o Adquirir)

// Función para vincular eventos de selección
function bindSelectionEvents() {
  const btnDevelop = document.getElementById('btn-develop');
  const btnAcquire = document.getElementById('btn-acquire');
  const mainContent = document.getElementById('main-content');
  const initialSelection = document.getElementById('initial-selection');

  btnDevelop.addEventListener('click', () => {
    selectedPurpose = "Desarrollar";
    startQuestionnaire();
  });

  btnAcquire.addEventListener('click', () => {
    selectedPurpose = "Adquirir";
    startQuestionnaire();
  });

  function startQuestionnaire() {
    const initialSelection = document.getElementById('initial-selection');
    const mainContent = document.getElementById('main-content');
    const questionContainer = document.getElementById('question-container');
    const startOverContainer = document.getElementById('start-over-container');
    const resultsSection = document.getElementById('results-section');
    const actionButtons = document.getElementById('action-buttons');
    const questionHeading = document.getElementById('question-heading');

    // Actualizar el encabezado con la opción seleccionada
    questionHeading.textContent = `Cuestionario - ${selectedPurpose}`;

    initialSelection.classList.add('d-none'); // Ocultar selección inicial
    mainContent.classList.remove('d-none'); // Mostrar contenido principal
    questionContainer.classList.remove('d-none'); // Mostrar el contenedor de preguntas
    startOverContainer.classList.remove('d-none'); // Mostrar botón de inicio
    resultsSection.classList.remove('d-none'); // Mostrar la sección de resultados
    actionButtons.classList.remove('d-none'); // Mostrar los botones de acción

    fetchData(selectedPurpose); // Cargar preguntas según el propósito
  }
}

// Función para cargar datos desde el JSON según el propósito
function fetchData(purpose) {
  fetch('sesgos.json')
    .then(response => {
      if (!response.ok) {
        console.error(`Error al cargar sesgos.json: ${response.statusText}`);
        throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data || !data.sesgos) {
        throw new Error('El archivo JSON no contiene un formato válido.');
      }
      steps = data.sesgos.filter(step => step.Propósito === purpose);
      if (steps.length === 0) {
        throw new Error('No hay datos disponibles para la selección realizada.');
      }
      console.log(`Datos cargados correctamente para ${purpose}:`, steps);
      updateProgressBar();
      loadQuestion(0); // Cargar la primera pregunta
    })
    .catch(error => console.error('Error al cargar los datos:', error));
}

// Función para cargar una pregunta específica
function loadQuestion(index) {
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options');

  if (!questionText || !optionsContainer) {
    console.error('No se encontraron los elementos del DOM para cargar preguntas.');
    return;
  }

  if (index < steps.length) {
    const step = steps[index];
    questionText.textContent = `${step.Fase} - ${step["Pregunta Clave"]}`;
    optionsContainer.innerHTML = '';

    ["Sí", "No"].forEach(option => {
      const button = document.createElement('button');
      button.className = 'btn btn-primary m-2';
      button.textContent = option;
      button.onclick = () => handleAnswer(step, option);
      optionsContainer.appendChild(button);
    });
  } else {
    questionText.textContent = '¡Test finalizado! Gracias por responder.';
    optionsContainer.innerHTML = '';
    updateProgressBar();
  }
}

// Manejo de respuesta del usuario
function handleAnswer(step, answer) {
  const response = answer === "Sí" ? step["Opción Sí"] : step["Opción No"];
  const table = document.getElementById('results-table');

  if (!table) {
    console.error('Elemento de tabla no encontrado.');
    return;
  }

  const row = table.insertRow();
  row.insertCell(0).textContent = step.ID;
  row.insertCell(1).textContent = step.Fase;
  row.insertCell(2).textContent = step["Pregunta Clave"];
  row.insertCell(3).textContent = answer;
  row.insertCell(4).textContent = response;

  const tableContainer = document.getElementById('table-container');
  if (tableContainer) {
    tableContainer.scrollTop = tableContainer.scrollHeight;
  }

  if (answer === "No") {
    showModal(step.Descripción, response);
  }

  currentStepIndex++;
  updateProgressBar();
  loadQuestion(currentStepIndex);
}

// Mostrar modal con información del sesgo
function showModal(description, tool) {
  const modalDescription = document.getElementById('modal-description');
  const modalTool = document.getElementById('modal-tool');

  if (!modalDescription || !modalTool) {
    console.error('Elementos del modal no encontrados.');
    return;
  }

  modalDescription.textContent = description;
  modalTool.textContent = tool;

  const modal = new bootstrap.Modal(document.getElementById('infoModal'));
  modal.show();
}

// Actualizar barra de progreso
function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');

  if (!progressBar) {
    console.error('No se encontró el elemento de barra de progreso.');
    return;
  }

  const progressPercentage = ((currentStepIndex / steps.length) * 100).toFixed(0);
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.setAttribute('aria-valuenow', progressPercentage);
  progressBar.textContent = `${progressPercentage}%`;
  console.log('Barra de progreso actualizada:', progressPercentage + '%');
}

// Reiniciar proceso
function resetProcess() {
  console.log('Reiniciando el proceso...');
  currentStepIndex = 0;

  const table = document.getElementById('results-table');
  if (table) {
    table.innerHTML = '';
    console.log('Tabla de resultados limpiada.');
  } else {
    console.error('No se encontró el elemento de tabla de resultados.');
  }

  updateProgressBar();
  loadQuestion(currentStepIndex);
  alert('El proceso ha sido reiniciado.');
}

// Deshacer el último paso
function undoLastStep() {
  console.log('Deshaciendo el último paso...');

  if (currentStepIndex > 0) {
    currentStepIndex--;

    const table = document.getElementById('results-table');
    if (table && table.rows.length > 0) {
      table.deleteRow(table.rows.length - 1);
      console.log('Última fila eliminada de la tabla.');
    } else {
      console.error('No hay filas en la tabla para eliminar.');
    }

    updateProgressBar();
    loadQuestion(currentStepIndex);
  } else {
    console.warn('No hay pasos previos para deshacer.');
    alert('No puedes deshacer más pasos.');
  }
}

function goToStart() {
  console.log('Volviendo a la pantalla inicial...');

  const mainContent = document.getElementById('main-content');
  const questionContainer = document.getElementById('question-container');
  const initialSelection = document.getElementById('initial-selection');
  const startOverContainer = document.getElementById('start-over-container');
  const resultsSection = document.getElementById('results-section');
  const actionButtons = document.getElementById('action-buttons');
  const resultsTable = document.getElementById('results-table');

  // Ocultar secciones activas
  mainContent.classList.add('d-none');
  questionContainer.classList.add('d-none');
  startOverContainer.classList.add('d-none');
  resultsSection.classList.add('d-none');
  actionButtons.classList.add('d-none'); // Ocultar botones de acción

  // Mostrar selección inicial
  initialSelection.classList.remove('d-none');

  // Reiniciar variables y limpiar datos
  currentStepIndex = 0;
  steps = [];
  selectedPurpose = "";

  // Limpiar tabla de resultados
  if (resultsTable) {
    resultsTable.innerHTML = '';
    console.log('Tabla de resultados reiniciada.');
  }

  // Reiniciar barra de progreso
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', '0');
    progressBar.textContent = '0%';
    console.log('Barra de progreso reiniciada.');
  }

  console.log('Pantalla inicial cargada y formulario reiniciado.');
}

// Imprimir resultados de la tabla
function printResults() {
    const printWindow = window.open('', '', 'height=500,width=800');
    const tableContent = document.getElementById('table-container').innerHTML;

    // Título dinámico basado en la opción seleccionada
    const title = `Resultados del Árbol de Decisión - ${selectedPurpose}`;

    const style = `
        <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #343a40; color: white; }
        </style>
    `;

    printWindow.document.write('<html><head><title>' + title + '</title>');
    printWindow.document.write(style);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>' + title + '</h2>');
    printWindow.document.write(tableContent);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.print();
}
