const lifecycleStages = {
    desarrollo: [
        {
            id: 'planificacion',
            title: 'Planificación y Diseño',
            risks: ['Definición sesgada de objetivos', 'Falta de consideraciones éticas'],
            mitigation: ['Realizar evaluación ética', 'Conformar equipos diversos'],
            tools: ['Fairness Flow', 'AI Fairness 360']
        },
        {
            id: 'datos',
            title: 'Recopilación y Tratamiento de Datos',
            risks: ['Subrepresentación de grupos', 'Perpetuación de estereotipos'],
            mitigation: ['Análisis demográfico de datos', 'Muestreo balanceado'],
            tools: ['Aequitas', 'Data Bias Detection Toolkit']
        },
        {
            id: 'modelo',
            title: 'Creación de Modelo(s) y/o Adaptación de Modelo(s)',
            risks: ['Diseño que favorece sesgos', 'Falta de métricas de equidad'],
            mitigation: ['Implementar algoritmos de fairness', 'Usar métricas interseccionales'],
            tools: ['Fairlearn', 'Google What-If Tool', 'AI Fairness 360']
        },
        {
            id: 'prueba',
            title: 'Prueba, Evaluación, Verificación y Validación',
            risks: ['Pruebas no representativas', 'Validación sesgada'],
            mitigation: ['Validación cruzada con múltiples datasets', 'Pruebas interseccionales'],
            tools: ['Fairness Indicators', 'Model Card Toolkit']
        },
        {
            id: 'despliegue',
            title: 'Entrada en Servicio',
            risks: ['Impacto negativo inicial', 'Falta de retroalimentación'],
            mitigation: ['Despliegue gradual', 'Canales de retroalimentación'],
            tools: ['Responsible AI Dashboard', 'Fairness Flow']
        },
        {
            id: 'monitoreo',
            title: 'Explotación y Supervisión (Monitoreo y Ajuste)',
            risks: ['Cambios no detectados', 'Acumulación de sesgos en producción'],
            mitigation: ['Auditorías periódicas', 'Reentrenamiento regular'],
            tools: ['Evidently AI', 'Amazon SageMaker Model Monitor']
        },
        {
            id: 'retiro',
            title: 'Retirada/Desmantelamiento',
            risks: ['Impacto negativo al dejar de usar el sistema', 'Falta de planificación inclusiva'],
            mitigation: ['Planificar la transición de servicios', 'Documentar lecciones aprendidas'],
            tools: ['Decommissioning Toolkit', 'Ethical Shutdown Framework']
        }
    ],
    adquisicion: [
        {
            id: 'identificacion',
            title: 'Identificación de Necesidad',
            risks: ['Requisitos excluyentes', 'Falta de métricas de equidad'],
            mitigation: ['Documentar inclusión', 'Involucrar stakeholders diversos'],
            tools: ['Fairness Questionnaire', 'Inclusive Requirements Toolkit']
        },
        {
            id: 'evaluacion',
            title: 'Evaluación de Proveedores',
            risks: ['Prácticas sesgadas', 'Falta de transparencia'],
            mitigation: ['Solicitar auditorías de sesgo', 'Evaluar documentación técnica'],
            tools: ['Vendor Fairness Assessment', 'Model Card Analysis']
        },
        {
            id: 'integracion',
            title: 'Integración de Soluciones de IA',
            risks: ['Incompatibilidad técnica', 'Sesgos heredados'],
            mitigation: ['Pruebas en entornos reales', 'Revisión técnica exhaustiva'],
            tools: ['Integration Toolkit', 'Bias Detection Toolkit']
        },
        {
            id: 'despliegue',
            title: 'Entrada en Servicio (Adquisición)',
            risks: ['Impacto desproporcionado', 'Falta de monitoreo inicial'],
            mitigation: ['Implementación gradual', 'Auditorías iniciales'],
            tools: ['Responsible AI Dashboard', 'Fairness Flow']
        },
        {
            id: 'supervision',
            title: 'Supervisión y Mantenimiento',
            risks: ['Cambios demográficos ignorados', 'Riesgos acumulados en producción'],
            mitigation: ['Monitoreo continuo', 'Auditorías frecuentes'],
            tools: ['Amazon SageMaker Model Monitor', 'Fiddler AI Observability Platform']
        }
    ]
};

function setContext(context) {
    const fasesContainer = document.getElementById('fases');
    const stagesContainer = document.getElementById('stagesContainer');
    const stageDetails = document.getElementById('stageDetails');

    // Cambiar color del botón seleccionado
    const btnDesarrollo = document.getElementById('btnDesarrollo');
    const btnAdquisicion = document.getElementById('btnAdquisicion');

    if (context === 'desarrollo') {
        btnDesarrollo.classList.remove('btn-secondary');
        btnDesarrollo.classList.add('btn-primary');
        btnAdquisicion.classList.remove('btn-primary');
        btnAdquisicion.classList.add('btn-secondary');
    } else if (context === 'adquisicion') {
        btnAdquisicion.classList.remove('btn-secondary');
        btnAdquisicion.classList.add('btn-primary');
        btnDesarrollo.classList.remove('btn-primary');
        btnDesarrollo.classList.add('btn-secondary');
    }

    // Limpia el contenedor de etapas
    stagesContainer.innerHTML = '';

    // Oculta el contenedor de detalles
    stageDetails.classList.add('d-none');

    // Verifica si el contexto es válido
    if (!lifecycleStages[context]) {
        // Oculta el contenedor de etapas y el contenedor principal si no se selecciona un contexto
        stagesContainer.classList.add('d-none');
        fasesContainer.classList.add('d-none');
        return;
    }

    // Muestra el contenedor de etapas y el contenedor principal si el contexto es válido
    fasesContainer.classList.remove('d-none');
    stagesContainer.classList.remove('d-none');

    // Crear un contenedor para las etapas en dos columnas responsivas
    const row = document.createElement('div');
    row.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'g-3');

    lifecycleStages[context].forEach(stage => {
        const col = document.createElement('div');
        col.classList.add('col'); // Columna para cada etapa

        const stageButton = document.createElement('button');
        stageButton.textContent = stage.title;
        stageButton.classList.add('btn', 'btn-outline-primary', 'w-100'); // Botón ocupa todo el ancho
        stageButton.dataset.stageId = stage.id; // Identificador único para el botón
        stageButton.onclick = () => showStageDetails(stage, stageButton);

        col.appendChild(stageButton); // Añadir el botón a la columna
        row.appendChild(col);         // Añadir la columna a la fila
    });

    stagesContainer.appendChild(row); // Añadir la fila al contenedor principal
}

function showStageDetails(stage, button) {
    const stageDetails = document.getElementById('stageDetails');
    const stageTitleElement = document.getElementById('stageTitleElement');
    const risksList = document.getElementById('risksList');
    const mitigationsList = document.getElementById('mitigationsList');
    const toolsList = document.getElementById('toolsList');

    // Actualiza el contenido dinámico con "Fase:" antes del título
    stageTitleElement.textContent = `Etapa: ${stage.title}`;
    risksList.innerHTML = stage.risks.map(risk => `<li>${risk}</li>`).join('');
    mitigationsList.innerHTML = stage.mitigation.map(strategy => `<li>${strategy}</li>`).join('');
    toolsList.innerHTML = stage.tools.map(tool => `
        <span class="badge bg-primary text-light">${tool}</span>
    `).join('');

    // Asegúrate de que el contenedor de detalles esté visible
    stageDetails.classList.remove('d-none');

    // Resalta el botón seleccionado (etapa)
    const allButtons = document.querySelectorAll('#stagesContainer button'); // Selecciona todos los botones de fases
    allButtons.forEach(btn => btn.classList.remove('btn-primary', 'text-light')); // Remueve clases de resalte
    allButtons.forEach(btn => btn.classList.add('btn-outline-primary')); // Restaura las clases de estilo normal

    // Añade clases de resalte al botón actual
    button.classList.remove('btn-outline-primary');
    button.classList.add('btn-primary', 'text-light');

    // Desplaza la vista al contenedor de detalles
    stageDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Accesibilidad: agrega foco al contenedor
    stageDetails.setAttribute('tabindex', '-1'); // Permitir foco temporal
    stageDetails.focus(); // Foco en el elemento
}


// Inicializar evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const stagesContainer = document.getElementById('stagesContainer');
    const stageDetails = document.getElementById('stageDetails');

    // Ocultar ambos contenedores inicialmente
    stagesContainer.classList.add('d-none');
    stageDetails.classList.add('d-none');
});
