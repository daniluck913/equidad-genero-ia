document.addEventListener('DOMContentLoaded', async function () {
    const contextButton = document.getElementById('contextButton');
    const optionsContainer = document.getElementById('optionsContainer');
    const btnDesarrollo = document.getElementById('btnDesarrollo');
    const btnAdquisicion = document.getElementById('btnAdquisicion');
    const contextHeader = document.getElementById('contextHeader');
    const fasesContainer = document.getElementById('fases');
    const stagesContainer = document.getElementById('stagesContainer');
    const stageDetails = document.getElementById('stageDetails');
    const resetButton = document.getElementById('resetButton');

    let lifecycleStages = {
        desarrollo: { message: '', stages: [] },
        adquisicion: { message: '', stages: [] }
    };

    // Ocultar inicialmente los botones y contenedores
    [optionsContainer, fasesContainer, stageDetails, resetButton].forEach(el => el.classList.add('d-none'));

    // Cargar datos desde Excel
    await loadExcelData();

    contextButton.addEventListener('click', function () {
        optionsContainer.classList.remove('d-none');
        optionsContainer.classList.add('d-block');
        resetButton.classList.remove('d-none');
    });

    btnDesarrollo.addEventListener('click', function () {
        setContext('desarrollo');
    });

    btnAdquisicion.addEventListener('click', function () {
        setContext('adquisicion');
    });

    async function loadExcelData() {
        try {
            const response = await fetch('data/data.xlsx');
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = 'Árbol de decisión';
            if (!workbook.SheetNames.includes(sheetName)) {
                throw new Error(`La hoja "${sheetName}" no existe en el archivo Excel.`);
            }

            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Transformar datos en la estructura necesaria
            lifecycleStages = transformDataToLifecycleStages(sheetData);
            console.log("Lifecycle Stages cargados:", lifecycleStages); // Depuración
        } catch (error) {
            console.error('Error al cargar el archivo Excel:', error);
            alert('No se pudo cargar el archivo Excel.');
        }
    }

    function transformDataToLifecycleStages(sheetData) {
        const stagesByContext = {
            desarrollo: { message: '', stages: [] },
            adquisicion: { message: '', stages: [] }
        };

        sheetData.forEach(row => {
            const context = row['Contexto']?.trim().toLowerCase(); // Normaliza el contexto
            const phases = row['Fase']?.split(';').map(fase => fase.trim()); // Divide las fases por ';' y elimina espacios
            const riskType = row['Tipo de sesgo'];
            const riskSubtype = row['Subtipos']; // Extraer el subtipo
            const riskDescription = row['Definición'];
            const mitigationAction = row['Acción para mitigarlo'];
            const tools = row['Tipo de heramienta'] ? row['Tipo de heramienta'].split(',').map(tool => tool.trim()) : [];
            const message = row['Pregunta'];

            // Configura el mensaje del contexto
            if (context.includes('desarrollo')) stagesByContext.desarrollo.message = message || stagesByContext.desarrollo.message;
            if (context.includes('adquisición')) stagesByContext.adquisicion.message = message || stagesByContext.adquisicion.message;

            // Asigna riesgos a las fases correspondientes
            phases.forEach(phase => {
                if (context.includes('desarrollo')) {
                    assignPhase(stagesByContext.desarrollo, phase, riskType, riskSubtype, riskDescription, mitigationAction, tools);
                }
                if (context.includes('adquisición')) {
                    assignPhase(stagesByContext.adquisicion, phase, riskType, riskSubtype, riskDescription, mitigationAction, tools);
                }
            });
        });

        return stagesByContext;
    }

    function assignPhase(contextObject, phase, riskType, riskSubtype, riskDescription, mitigationAction, tools) {
        let stage = contextObject.stages.find(stage => stage.title === phase);
    
        // Si no existe la etapa, crearla
        if (!stage) {
            stage = { title: phase, risks: [] };
            contextObject.stages.push(stage);
        }
    
        // Agrega el riesgo a la etapa
        stage.risks.push({
            type: riskType,
            subtype: riskSubtype,
            description: riskDescription,
            action: mitigationAction,
            tools
        });
    }
    

    function setContext(context) {
        console.log("Contexto recibido:", context);
        console.log("Lifecycle Stages disponibles:", lifecycleStages);

        if (!lifecycleStages[context]) {
            console.error("Contexto no válido:", context);
            return;
        }

        const message = lifecycleStages[context].message;
        contextHeader.textContent = message;

        btnDesarrollo.classList.toggle('btn-primary', context === 'desarrollo');
        btnAdquisicion.classList.toggle('btn-primary', context === 'adquisicion');
        btnDesarrollo.classList.toggle('btn-secondary', context !== 'desarrollo');
        btnAdquisicion.classList.toggle('btn-secondary', context !== 'adquisicion');

        fasesContainer.classList.remove('d-none');
        loadStages(context);
    }

    function loadStages(context) {
        console.log("Cargando etapas para el contexto:", context);

        const stages = lifecycleStages[context]?.stages || [];
        if (!stages.length) {
            console.error("No hay etapas disponibles para el contexto:", context);
            stagesContainer.innerHTML = '<p>No se encontraron etapas para este contexto.</p>';
            return;
        }

        stagesContainer.innerHTML = ''; // Limpia contenido previo

        const row = document.createElement('div');
        row.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'g-3');

        stages.forEach(stage => {
            console.log("Agregando etapa para el contexto:", stage);

            const col = document.createElement('div');
            col.classList.add('col');

            const stageButton = document.createElement('button');
            stageButton.textContent = stage.title;
            stageButton.classList.add('btn', 'btn-outline-primary', 'w-100');

            stageButton.onclick = () => showStageDetails(stage);

            col.appendChild(stageButton);
            row.appendChild(col);
        });

        stagesContainer.appendChild(row);
    }

    function showStageDetails(stage) {
        document.getElementById('stageTitleElement').textContent = `Etapa: ${stage.title}`;
    
        // Agrupar riesgos por tipo de sesgo
        const risksByType = {};
        stage.risks.forEach(risk => {
            if (!risksByType[risk.type]) {
                risksByType[risk.type] = [];
            }
            risksByType[risk.type].push(risk);
        });
    
        // Construir la lista jerárquica de riesgos
        const risksHtml = Object.entries(risksByType).map(([type, risks]) => {
            // Conjuntos para eliminar duplicados
            const uniqueSubtypes = new Set();
            const uniqueDescriptions = new Set();
    
            const riskDetails = risks.map(risk => {
                if (uniqueSubtypes.has(risk.subtype) && uniqueDescriptions.has(risk.description)) {
                    return ''; // Si ya existe, no agregarlo
                }
                uniqueSubtypes.add(risk.subtype);
                uniqueDescriptions.add(risk.description);
    
                return `
                    <li>
                        <strong>Subtipo:</strong> ${risk.subtype || 'N/A'}<br>
                        <strong>Descripción:</strong> ${risk.description}<br>
                    </li>
                `;
            }).join('');
    
            return `
                <li>
                    <strong>Tipo de Sesgo:</strong> ${type}
                    <ul>${riskDetails}</ul>
                </li>
            `;
        }).join('');
    
        document.getElementById('risksList').innerHTML = risksHtml;
    
        // Filtrar y mostrar acciones únicas para mitigar
        const uniqueActions = [...new Set(stage.risks.map(risk => risk.action))];
        document.getElementById('mitigationsList').innerHTML = uniqueActions.map(action => `
            <li>${action}</li>
        `).join('');
    
        // Filtrar y mostrar herramientas únicas
        const uniqueTools = [...new Set(stage.risks.flatMap(risk => risk.tools))];
        document.getElementById('toolsList').innerHTML = uniqueTools.map(tool => `
            <span class="badge bg-primary text-light">${tool}</span>
        `).join('');
    
        stageDetails.classList.remove('d-none');
        stageDetails.scrollIntoView({ behavior: 'smooth' });
    }
    
});
