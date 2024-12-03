let treeData = [];
let currentQuestionIndex = 0;
let userChoice = "";
let selectedPhase = "";
let filteredQuestions = [];

// Fases por contexto
const phases = {
    Desarrollar: [
        "Planificación y diseño",
        "Recopilación y tratamiento de datos",
        "Creación de modelo(s) y/o adaptación de modelo(s)",
        "Prueba, evaluación, verificación y validación",
        "Entrada en servicio/despliegue",
        "Explotación y supervisión (Monitoreo y ajuste)",
        "Retirada/desmantelamiento",
        "Selección del proveedor"
    ],
    Adquirir: [
        "Selección del proveedor",
        "Validación técnica",
        "Pruebas antes de la adquisición",
        "Implementación"
    ]
};

// Cargar el archivo Excel
fetch('data.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = 'Árbol_v4'; // Nombre de la hoja
        const sheet = workbook.Sheets[sheetName];

        // Procesar los datos y garantizar que las fases sean listas y válidas
        treeData = XLSX.utils.sheet_to_json(sheet).map(item => {
            item.Fase = typeof item.Fase === "string" && item.Fase.trim()
                ? item.Fase.split(";").map(f => f.trim())
                : [];
            item.Contexto = typeof item.Contexto === "string" && item.Contexto.trim()
                ? item.Contexto.trim()
                : "";
            return item;
        });

        console.log("Datos cargados:", treeData); // Validación temporal
        askInitialQuestion();
    })
    .catch(error => console.error('Error al cargar el archivo Excel:', error));

// Pregunta inicial
function askInitialQuestion() {
    document.getElementById("question-container").innerHTML = `
        <p id="question" class="fs-4 fw-bold text-center">
            ¿Desea desarrollar una solución de IA o adquirir una solución basada en IA?
        </p>
        <div class="d-grid gap-3">
            <button class="btn btn-primary" onclick="selectContext('Desarrollar')">Desarrollar</button>
            <button class="btn btn-secondary" onclick="selectContext('Adquirir')">Adquirir</button>
        </div>
    `;
}

// Seleccionar el contexto
function selectContext(context) {
    userChoice = context; // Usar el contexto tal cual
    loadPhaseOptions();
}

// Mostrar las fases según el contexto seleccionado
function loadPhaseOptions() {
    const contextPhases = phases[userChoice];

    if (!contextPhases) {
        console.error(`Contexto inválido: "${userChoice}".`);
        document.getElementById("question-container").innerHTML = `
            <h2 class="text-center">Contexto no válido</h2>
            <button class="btn btn-outline-dark mt-3 w-100" onclick="askInitialQuestion()">Volver al inicio</button>
        `;
        return;
    }

    let phaseButtons = contextPhases
        .map(phase => `<button class="btn btn-outline-primary mb-2 w-100" onclick="selectPhase('${phase}')">${phase}</button>`)
        .join("");

    document.getElementById("question-container").innerHTML = `
        <p id="question" class="fs-4 fw-bold text-center">
            Ha seleccionado "${userChoice}". ¿Qué fase desea explorar?
        </p>
        <div id="phase-buttons">${phaseButtons}</div>
    `;
}

// Seleccionar una fase
function selectPhase(phase) {
    selectedPhase = phase.trim();

    filteredQuestions = treeData.filter(item => {
        const contextMatches = item.Contexto === userChoice.trim();
        const phaseMatches = Array.isArray(item.Fase) &&
            item.Fase.map(f => f.trim().toLowerCase()).includes(selectedPhase.toLowerCase());
        return contextMatches && phaseMatches;
    });

    console.log("Fases cargadas en treeData:", treeData.map(item => item.Fase));
    console.log("Contexto seleccionado:", userChoice);
    console.log("Fase seleccionada:", selectedPhase);

    if (filteredQuestions.length === 0) {
        console.error("No se encontraron preguntas para la fase:", selectedPhase);
        console.log("Debugging info:", { selectedPhase, treeData, userChoice });

        document.getElementById("question-container").innerHTML = `
            <h2 class="text-center">No se encontraron preguntas para esta fase.</h2>
            <button class="btn btn-outline-dark mt-3 w-100" onclick="loadPhaseOptions()">Volver a las fases</button>
        `;
        return;
    }

    currentQuestionIndex = 0;
    loadQuestion();
}

// Cargar preguntas
function loadQuestion() {
    if (currentQuestionIndex >= filteredQuestions.length) {
        showResults();
        return;
    }

    const questionData = filteredQuestions[currentQuestionIndex];
    document.getElementById("question-container").innerHTML = `
        <p id="question" class="fs-4 fw-bold text-center">${questionData.Pregunta}</p>
        <div class="d-grid gap-3">
            <button id="option1" class="btn btn-primary">Sí</button>
            <button id="option2" class="btn btn-secondary">No</button>
        </div>
    `;

    document.getElementById("option1").onclick = () => {
        currentQuestionIndex++;
        loadQuestion();
    };

    document.getElementById("option2").onclick = () => showRisks(questionData);
}

// Mostrar riesgos
function showRisks(data) {
    document.getElementById("question-container").innerHTML = `
        <h2 class="text-center">Resultados</h2>
        <p class="fw-bold text-danger">Posibles sesgos: ${data.Subtipos || "No especificado"}</p>
        <p class="fw-bold text-primary">Acciones recomendadas: ${data["Acción para mitigarlo"] || "No especificadas"}</p>
        <p class="fw-bold text-success">Herramientas sugeridas: ${data["Tipo de herramienta"] || "No especificadas"}</p>
        <button class="btn btn-outline-dark mt-3 w-100" onclick="loadQuestion()">Volver</button>
    `;
}
