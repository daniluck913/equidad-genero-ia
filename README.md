# Árbol de Decisión: Guía de Buenas Prácticas y Catálogo de Herramientas

Este proyecto, alojado en la carpeta `Producto3_Html`, es una implementación interactiva desarrollada en **HTML**, **CSS** y **JavaScript**, diseñada para apoyar el desarrollo y la adopción de sistemas de inteligencia artificial (IA) éticos e inclusivos. Su objetivo principal es proporcionar recursos y herramientas que permitan **identificar, prevenir y mitigar sesgos de género** en el ecosistema de la IA.

## Componentes Principales

1. **Árbol de Decisión**  
   Herramienta interactiva que guía a los usuarios en la identificación de sesgos y en la toma de decisiones responsables durante el desarrollo o adquisición de soluciones de IA.

2. **Guía de Buenas Prácticas**  
   Recomendaciones prácticas y estructuradas para diseñar, implementar y monitorear sistemas de IA que respeten los principios de equidad y ética.

3. **Catálogo de Herramientas**  
   Colección de recursos técnicos, frameworks y metodologías prácticas diseñadas para abordar los sesgos de género en diferentes etapas del ciclo de vida de la IA. 

## **Estructura del Proyecto**

```
Producto3_Html/
├── assets/
│   └── logo.png              # Logotipo institucional del proyecto
├── css/
│   ├── arbol.css             # Estilos específicos del Árbol de Decisión
│   ├── catalogo.css          # Estilos para el Catálogo de Herramientas
│   ├── guia.css              # Estilos para la Guía de Buenas Prácticas
│   └── styles.css            # Estilos generales y del encabezado
├── data/
│   └── data.xlsx             # Fuente de datos para el catálogo y la guía
├── js/
│   ├── arbol.js              # Lógica del Árbol de Decisión
│   ├── catalogo.js           # Lógica de interacción del Catálogo
│   ├── guia.js               # Lógica de filtrado y carga de la Guía
│   ├── header.js             # Inserta el encabezado dinámicamente
│   └── scripts.js            # Carga dinámica de contenido general
├── arbol.html                # Vista del Árbol de Decisión
├── catalogo.html             # Vista del Catálogo de Herramientas
├── guia.html                 # Vista principal de la Guía de Buenas Prácticas
├── guia.pdf                  # Versión descargable de la guía en PDF
├── header.html               # Encabezado de navegación común
├── footer.html               # Pie de página (si aplica)
├── index.html                # Página de inicio y redirección al contenido
└── README.md                 # Documentación técnica del proyecto
```

## Requisitos

1. **Navegador web moderno**: El proyecto es compatible con navegadores como Google Chrome, Mozilla Firefox, Microsoft Edge, entre otros.
2. **Servidor web (requerido para uso completo)**: Para que los módulos que cargan datos desde `data/data.xlsx` funcionen correctamente, es necesario ejecutar el proyecto en un entorno con servidor. Algunas opciones recomendadas:
   - Live Server (extensión de Visual Studio Code)
   - Python: `python -m http.server`
   - Node.js: `npx http-server`

## Instrucciones de Uso

1. Descarga o clona la carpeta `Producto3_Html`.
2. Abre el proyecto utilizando un servidor local.
3. Accede al archivo `index.html` desde `http://localhost` o el puerto asignado por tu servidor.
4. Desde el menú de navegación podrás explorar:
   - **Árbol de Decisión** (`arbol.html`)
   - **Catálogo de Herramientas** (`catalogo.html`)
   - **Guía de Buenas Prácticas** (`guia.html`)
   - **Términos y condiciones** (modal desde el encabezado)

## Personalización

- **Estilos**: Modifica los archivos de la carpeta `css/` para cambiar la apariencia del proyecto.
- **Lógica**: Ajusta los scripts en la carpeta `js/` para cambiar comportamientos o flujos.
- **Contenido**: Edita `data/data.xlsx` para actualizar la información del catálogo o la guía, respetando la estructura de las hojas.

## Licencia

Este proyecto fue desarrollado en el marco del contrato **DNP-1104-2024** para el **Departamento Nacional de Planeación (DNP)**, con el propósito de promover la equidad de género en el diseño, desarrollo y adopción de tecnologías de inteligencia artificial en Colombia.

## Contacto

Para dudas, soporte o comentarios, por favor contactar a:

**Dirección de Desarrollo Digital**  
**Departamento Nacional de Planeación (DNP)**  
📧 servicioalciudadano@dnp.gov.co  
🌐 [www.dnp.gov.co](https://www.dnp.gov.co/atencion-al-ciudadano)
