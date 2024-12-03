const lifecycleStages = {
    desarrollo: {
        message: "A continuación, se describen los posibles sesgos de género que pueden surgir en cada etapa del ciclo de vida para el desarrollo de una solución de inteligencia artificial, junto con acciones clave para identificarlos, prevenirlos y mitigarlos de manera efectiva. ¿En qué etapa del ciclo de vida se encuentra o desea obtener orientación sobre cómo abordar los sesgos de género?",
        stages: [
            {
                id: 'planificacion',
                title: 'Planificación y Diseño',
                risks: [
                    {
                        type: 'Subrepresentación de géneros',
                        description: 'El sesgo de género en algoritmos ocurre cuando los datos favorecen a un género y excluyen a otros, perpetuando desigualdades.',
                        action: 'Asegurar una representación equilibrada de los géneros y grupos LGBTIQ+ en los datos de entrenamiento.',
                        tools: ['Fairlearn']
                    },
                    {
                        type: 'Sesgo Histórico',
                        description: 'Refleja desigualdades históricas en los datos de entrenamiento, amplificando discriminaciones previas.',
                        action: 'Identificar y ajustar los datos históricos para garantizar representatividad.',
                        tools: ['Fairlearn', 'AI Fairness 360']
                    }
                ]
            },
            {
                id: 'datos',
                title: 'Recopilación y Tratamiento de Datos',
                risks: [
                    {
                        type: 'Sesgo Estereotipado',
                        description: 'Los datos refuerzan estereotipos de género, como asociar a las mujeres con profesiones de cuidado.',
                        action: 'Eliminar asociaciones sesgadas entre géneros y profesiones.',
                        tools: ['Modelos de experto (MoE)', 'AI Fairness 360']
                    },
                    {
                        type: 'Sesgo por Exclusión',
                        description: 'Ocurre al no considerar características específicas de género.',
                        action: 'Incluir diferencias fisiológicas y de contexto entre géneros.',
                        tools: ['Fairlearn']
                    }
                ]
            },
            {
                id: 'modelo',
                title: 'Creación de Modelo(s) y/o Adaptación de Modelo(s)',
                risks: [
                    {
                        type: 'Amplificación de estereotipos existentes',
                        description: 'El modelo refuerza estereotipos sociales preexistentes.',
                        action: 'Reentrenar el modelo con datos diversos y representativos.',
                        tools: ['Fairlearn', 'AI Fairness 360']
                    },
                    {
                        type: 'Predicciones alineadas con sesgos preconcebidos',
                        description: 'El modelo refuerza prejuicios introducidos por datos o desarrolladores.',
                        action: 'Implementar técnicas de debiasing y regularización de equidad.',
                        tools: ['AI Fairness 360']
                    }
                ]
            },
            {
                id: 'prueba',
                title: 'Prueba, Evaluación, Verificación y Validación',
                risks: [
                    {
                        type: 'Impacto discriminatorio en decisiones automatizadas',
                        description: 'Las decisiones automatizadas están influenciadas por sesgos de género.',
                        action: 'Evaluar sistemáticamente que las decisiones no favorezcan injustamente a un género.',
                        tools: ['IBM Watson']
                    }
                ]
            },
            {
                id: 'despliegue',
                title: 'Entrada en Servicio/Despliegue',
                risks: [
                    {
                        type: 'Tratamiento diferencial según género',
                        description: 'El sistema trata de manera diferente a las personas según su género.',
                        action: 'Neutralizar diferencias basadas en género en las respuestas del sistema.',
                        tools: ['Gender Shades', 'Fairlearn']
                    }
                ]
            },
            {
                id: 'monitoreo',
                title: 'Explotación y Supervisión (Monitoreo y Ajuste)',
                risks: [
                    {
                        type: 'Reforzamiento de errores del modelo',
                        description: 'El sistema perpetúa y amplifica sesgos de género o errores con el tiempo.',
                        action: 'Realizar monitoreo continuo y ajustes regulares.',
                        tools: ['AI Fairness 360', 'Fairlearn']
                    }
                ]
            },
            {
                id: 'retiro',
                title: 'Retirada/Desmantelamiento',
                risks: [
                    {
                        type: 'Impacto en la transición',
                        description: 'El cese del sistema afecta a usuarios de género subrepresentado.',
                        action: 'Planificar una transición inclusiva para mitigar efectos negativos.',
                        tools: ['Inclusive AI', 'Ethical Shutdown Framework']
                    }
                ]
            }
        ]
    },
    adquisicion: {
        message: "A continuación, se presentan los posibles sesgos de género que pueden surgir en cada etapa de la adquisición de una solución de inteligencia artificial, junto con las acciones recomendadas para identificarlos, prevenirlos y mitigarlos. ¿En qué etapa se encuentra o desea obtener orientación sobre cómo abordar los sesgos de género?",
        stages: [
            {
                id: 'seleccion',
                title: 'Selección de Proveedores',
                risks: [
                    {
                        type: 'Falta de diversidad en equipos del proveedor',
                        description: 'El proveedor no cuenta con equipos diversos.',
                        action: 'Evaluar políticas de diversidad como requisito para la selección.',
                        tools: ['Audit-AI']
                    }
                ]
            },
            {
                id: 'validacion',
                title: 'Validación Técnica',
                risks: [
                    {
                        type: 'Uso de datos con sesgo de género',
                        description: 'Los datos utilizados refuerzan estereotipos.',
                        action: 'Solicitar documentación sobre representación justa en los datos.',
                        tools: ['Fairlearn']
                    }
                ]
            }
        ]
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const contextButton = document.getElementById('contextButton'); // Botón principal
    const optionsContainer = document.getElementById('optionsContainer'); // Contenedor de botones de contexto
    const btnDesarrollo = document.getElementById('btnDesarrollo'); // Botón Desarrollo
    const btnAdquisicion = document.getElementById('btnAdquisicion'); // Botón Adquisición
    const contextHeader = document.getElementById('contextHeader'); // Encabezado dinámico
    const fasesContainer = document.getElementById('fases'); // Contenedor de fases
    const stagesContainer = document.getElementById('stagesContainer'); // Contenedor de etapas
    const stageDetails = document.getElementById('stageDetails'); // Detalles de las fases
    const resetButton = document.getElementById('resetButton'); // Botón de reinicio

    // Ocultar inicialmente los botones de contexto, fases, detalles y botón de reinicio
    if (optionsContainer) optionsContainer.classList.add('d-none');
    if (fasesContainer) fasesContainer.classList.add('d-none');
    if (stageDetails) stageDetails.classList.add('d-none');
    if (resetButton) resetButton.classList.add('d-none');

    // Mostrar botones de contexto y habilitar el botón de reinicio al hacer clic en el botón principal
    contextButton.addEventListener('click', function () {
        optionsContainer.classList.remove('d-none');
        optionsContainer.classList.add('d-block');
        resetButton.classList.remove('d-none'); // Mostrar botón de reinicio
    });

    // Manejar eventos de los botones de contexto
    btnDesarrollo.addEventListener('click', function () {
        setContext('desarrollo');
    });

    btnAdquisicion.addEventListener('click', function () {
        setContext('adquisicion');
    });

    // Función para configurar el contexto
    function setContext(context) {
        // Verificar si el contexto es válido
        if (!lifecycleStages[context]) {
            console.error("Contexto no válido:", context);
            return;
        }

        // Actualizar el encabezado con el mensaje del contexto
        const message = lifecycleStages[context].message;
        if (contextHeader) {
            contextHeader.textContent = message;
        }

        // Cambiar colores de los botones
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

        // Mostrar fases relacionadas
        fasesContainer.classList.remove('d-none');
        loadStages(context);
    }

    // Función para cargar las etapas dinámicamente
    function loadStages(context) {
        stagesContainer.innerHTML = ''; // Limpia etapas previas

        const stages = lifecycleStages[context].stages;
        const row = document.createElement('div');
        row.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'g-3');

        stages.forEach(stage => {
            const col = document.createElement('div');
            col.classList.add('col');

            const stageButton = document.createElement('button');
            stageButton.textContent = stage.title;
            stageButton.classList.add('btn', 'btn-outline-primary', 'w-100');
            stageButton.dataset.stageId = stage.id;

            stageButton.onclick = () => showStageDetails(stage);

            col.appendChild(stageButton);
            row.appendChild(col);
        });

        stagesContainer.appendChild(row);
    }

    // Función para mostrar detalles de una etapa específica
    function showStageDetails(stage) {
        const stageTitleElement = document.getElementById('stageTitleElement');
        const risksList = document.getElementById('risksList');
        const mitigationsList = document.getElementById('mitigationsList');
        const toolsList = document.getElementById('toolsList');

        // Validación: verifica que todos los elementos existen
        if (!stageTitleElement || !risksList || !mitigationsList || !toolsList) {
            console.error('Algunos elementos necesarios no existen en el DOM');
            return;
        }

        // Actualiza el contenido dinámico
        stageTitleElement.textContent = `Etapa: ${stage.title}`;
        risksList.innerHTML = stage.risks.map(risk => `
            <li>
                <strong>Tipo:</strong> ${risk.type}<br>
                <strong>Descripción:</strong> ${risk.description}
            </li>
        `).join('');

        mitigationsList.innerHTML = stage.risks.map(risk => `
            <li>${risk.action}</li>
        `).join('');

        toolsList.innerHTML = stage.risks.flatMap(risk => risk.tools).map(tool => `
            <span class="badge bg-primary text-light">${tool}</span>
        `).join('');

        // Asegúrate de que el contenedor de detalles esté visible
        stageDetails.classList.remove('d-none');

        // Desplaza la vista al contenedor de detalles
        stageDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Accesibilidad: agrega foco al contenedor
        stageDetails.setAttribute('tabindex', '-1'); // Permitir foco temporal
        stageDetails.focus(); // Foco en el elemento
    }

    // Función para reiniciar el proceso
    resetButton.addEventListener('click', function () {
        // Ocultar contenedores
        optionsContainer.classList.add('d-none');
        fasesContainer.classList.add('d-none');
        stageDetails.classList.add('d-none');

        // Restaurar el estado inicial del botón principal
        contextButton.classList.remove('d-none');
        contextHeader.textContent = '';

        // Restaurar estilos de los botones de contexto
        btnDesarrollo.classList.remove('btn-primary');
        btnDesarrollo.classList.add('btn-secondary');
        btnAdquisicion.classList.remove('btn-primary');
        btnAdquisicion.classList.add('btn-secondary');

        // Limpiar contenido dinámico
        stagesContainer.innerHTML = '';
        document.getElementById('stageTitleElement').textContent = '';
        document.getElementById('risksList').innerHTML = '';
        document.getElementById('mitigationsList').innerHTML = '';
        document.getElementById('toolsList').innerHTML = '';

        // Ocultar botón de reinicio
        resetButton.classList.add('d-none');
    });
});
