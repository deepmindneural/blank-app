# Chatbot Print & Copy

## Descripción

Este proyecto implementa un chatbot inteligente para la empresa Print & Copy, especializado en proporcionar información sobre productos de impresión, generación de cotizaciones personalizadas y atención al cliente.

El chatbot utiliza la API de OpenAI (ChatGPT) para proporcionar respuestas contextuales e inteligentes, y almacena toda la información localmente mediante localStorage, incluyendo datos de usuario, historial de chat y cotizaciones.

## Características

- ✅ Interfaz de chat moderna y receptiva
- ✅ Integración con la API de OpenAI (ChatGPT)
- ✅ Almacenamiento local de datos de usuario y cotizaciones
- ✅ Base de datos de productos integrada
- ✅ Cálculo automático de precios basado en cantidades
- ✅ Generación y gestión de cotizaciones
- ✅ Respuestas personalizadas y contextuales
- ✅ Sistema de respaldo por si la API no está disponible

## Tecnologías

- HTML5, CSS3 y JavaScript puro
- API de OpenAI (ChatGPT)
- LocalStorage para persistencia de datos

## Estructura del Proyecto

```
/
├── index.html           # Página principal con el chat
├── css/
│   └── styles.css       # Estilos de la aplicación
└── js/
    ├── scripts.js       # Lógica principal y manejo de localStorage
    ├── chat.js          # Funciones de interacción del chat y API OpenAI
    ├── quotes.js        # Lógica de cotizaciones
    ├── config.js        # Configuración de la API key
    └── products.js      # Base de datos de productos
```

## Configuración y Uso

### Desarrollo Local

1. Clona este repositorio
2. Configura tu clave API de OpenAI en el archivo `js/config.js`
3. Abre el archivo `index.html` en un navegador moderno
4. ¡Disfruta del chatbot en acción!

### Despliegue con Coolify/nixpacks

Para desplegar esta aplicación con Coolify usando nixpacks:

1. En tu instancia de Coolify, crea un nuevo servicio
2. Selecciona el repositorio de GitHub
3. Especifica el directorio raíz del proyecto
4. Configura tu clave API de OpenAI antes del despliegue en el archivo `js/config.js` o como variable de entorno
5. En la sección de configuración, selecciona nixpacks como el constructor
6. En opciones avanzadas, asegúrate de servir el directorio raíz
7. Despliega la aplicación

**Nota importante**: Para seguridad, la clave API de OpenAI se configura en el archivo `js/config.js` y NO está incluida en el repositorio.

## Flujo de Uso

1. Al iniciar, el usuario ingresa su nombre, correo electrónico y teléfono
2. El chatbot saluda al usuario por su nombre y ofrece ayuda
3. El usuario puede preguntar sobre productos, precios o solicitar cotizaciones
4. El chatbot detecta menciones de productos con cantidades y los agrega a la cotización
5. La cotización se actualiza en tiempo real en el panel lateral
6. Toda la información se guarda en localStorage para persistencia

## Seguridad y Privacidad

- Los datos del usuario solo se almacenan localmente (en el navegador del cliente)
- El proyecto implementa validaciones básicas para la entrada de datos

## Licencia

Este proyecto está licenciado bajo MIT License.

## Desarrollado por

Windsurf Engineering Team para Print & Copy
