// Evento principal que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada, inicializando...');
    initializeApp();
  });
  
  // Función principal para inicializar la aplicación
  function initializeApp() {
    fetchData(); // Cargar los datos del JSON
    bindEvents(); // Vincular eventos a los botones
  }
  
  // Función para cargar datos desde el JSON
  function fetchData() {
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
        steps = data.sesgos;
        if (steps.length === 0) {
          throw new Error('No hay datos en el archivo JSON.');
        }
        console.log('Datos cargados correctamente:', steps);
        updateProgressBar();
        loadQuestion(0); // Cargar la primera pregunta
      })
      .catch(error => console.error('Error al cargar los datos:', error));
  }
  
  // Variables globales
  let steps = [];
  let currentStepIndex = 0;
  
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
      questionText.textContent = `${step.Fase} - ${step.Pregunta}`;
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
    row.insertCell(2).textContent = step.Pregunta;
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
  
  // Imprimir resultados de la tabla
  function printResults() {
    const printWindow = window.open('', '', 'height=500,width=800');
    const tableContent = document.getElementById('table-container').innerHTML;
  
    const style = `
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #343a40; color: white; }
      </style>
    `;
  
    printWindow.document.write('<html><head><title>Resultados</title>');
    printWindow.document.write(style);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>Resultados del Árbol de Decisión</h2>');
    printWindow.document.write(tableContent);
    printWindow.document.write('</body></html>');
  
    printWindow.document.close();
    printWindow.print();
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
  
  // Vincular eventos a botones
  function bindEvents() {
    const printButton = document.querySelector('.btn-primary');
    const resetButton = document.querySelector('.btn-secondary');
  
    if (printButton) {
      printButton.addEventListener('click', printResults);
      console.log('Evento de impresión vinculado.');
    } else {
      console.error('No se encontró el botón de impresión.');
    }
  
    if (resetButton) {
      resetButton.addEventListener('click', resetProcess);
      console.log('Evento de reinicio vinculado.');
    } else {
      console.error('No se encontró el botón de reinicio.');
    }
  
  }

// Deshacer el último paso
function undoLastStep() {
    console.log('Deshaciendo el último paso...');
  
    // Verificar si hay pasos previos
    if (currentStepIndex > 0) {
      // Retroceder el índice del paso actual
      currentStepIndex--;
      console.log('Índice actualizado:', currentStepIndex);
  
      // Eliminar la última fila de la tabla de resultados
      const table = document.getElementById('results-table');
      if (table && table.rows.length > 0) {
        table.deleteRow(table.rows.length - 1);
        console.log('Última fila eliminada de la tabla.');
      } else {
        console.error('No hay filas en la tabla para eliminar.');
      }
  
      // Actualizar la barra de progreso
      updateProgressBar();
  
      // Recargar la pregunta anterior
      loadQuestion(currentStepIndex);
    } else {
      console.warn('No hay pasos previos para deshacer.');
      alert('No puedes deshacer más pasos.');
    }
}
  
  