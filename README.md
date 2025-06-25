# 🖨️ Chatbot Print & Copy

Un chatbot inteligente para la empresa Print & Copy, especializado en proporcionar información sobre productos de impresión, generación de cotizaciones personalizadas y atención al cliente.

## ✨ Características

- 🤖 **Dos modos de IA**: ChatGPT real o sistema inteligente simulado
- 🔒 **Configuración segura**: API key no incluida en el código
- 💼 **Gestión de cotizaciones**: Cálculo automático y cotización en tiempo real
- 📱 **Diseño responsive**: Funciona en desktop y móvil
- 💾 **Almacenamiento local**: Guarda datos del usuario y historial
- 🎯 **Base de datos completa**: Todos los productos con precios exactos

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/print-copy-chatbot.git
cd print-copy-chatbot
```

### 2. Configurar API (Opcional)
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tu API key
# OPENAI_API_KEY=sk-tu-clave-aqui
```

### 3. Abrir en el navegador
```bash
# Simplemente abre index.html en tu navegador
open index.html
```

## 🔐 Configuración de API Key (3 Opciones)

### 🎯 Opción 1: Input del Usuario (Recomendado)
- Al usar el chatbot, escribe: **"configurar api"**
- Se te pedirá ingresar tu API key
- Se guarda localmente en tu navegador
- ✅ **Más seguro**: No está en el código

### 📝 Opción 2: Archivo .env (Para desarrollo)
```bash
# Crear archivo .env (no se sube a Git)
echo "OPENAI_API_KEY=sk-tu-clave-aqui" > .env
```

### 🌐 Opción 3: Variables de Entorno (Para despliegue)
```bash
# En tu servidor/hosting
export OPENAI_API_KEY="sk-tu-clave-aqui"
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **IA**: OpenAI ChatGPT API (opcional)
- **Almacenamiento**: LocalStorage
- **Hosting**: Compatible con GitHub Pages, Netlify, Vercel

## 📁 Estructura del Proyecto

```
print-copy-chatbot/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos de la aplicación
├── js/
│   ├── config.js          # Configuración segura de API
│   ├── scripts.js         # Lógica principal
│   ├── chat.js           # Manejo del chat y API
│   ├── quotes.js         # Sistema de cotizaciones
│   └── products.js       # Base de datos de productos
├── .env.example          # Ejemplo de configuración
├── .gitignore           # Archivos a ignorar
└── README.md            # Este archivo
```

## 🎮 Uso del Chatbot

### Modo Básico (Sin API)
```
Usuario: "Hola, ¿cuánto cuestan 50 tazas?"
Bot: "¡Hola! Las tazas para 50 unidades cuestan 3,25€ cada una..."
```

### Modo ChatGPT (Con API)
```
Usuario: "configurar api"
Bot: "🔑 Para usar ChatGPT, ingresa tu API Key..."
Usuario: [ingresa API key]
Bot: "🤖 ¡Perfecto! Ahora estoy usando ChatGPT real..."
```

### Ejemplos de Consultas
- `"Necesito productos para una boda de 150 personas"`
- `"¿Cuál es el precio de 100 abanicos Kronix?"`
- `"Quiero cotizar recordatorios para 75 unidades"`
- `"¿Qué productos tienen para eventos corporativos?"`

## 🌐 Despliegue

### GitHub Pages
```bash
# 1. Habilitar GitHub Pages en tu repositorio
# 2. Seleccionar branch main
# 3. ¡Listo! Tu chatbot estará en tu-usuario.github.io/print-copy-chatbot
```

### Netlify / Vercel
```bash
# 1. Conectar tu repositorio
# 2. Configurar variables de entorno (opcional):
#    OPENAI_API_KEY = tu-clave-api
# 3. Deploy automático
```

### Servidor Propio
```bash
# Simplemente subir archivos a tu servidor web
# El chatbot funciona con archivos estáticos
```

## 🔒 Seguridad

### ✅ Buenas Prácticas Implementadas
- ✅ API keys no incluidas en el código fuente
- ✅ `.gitignore` configurado para excluir archivos sensibles
- ✅ Almacenamiento local de configuración sensible
- ✅ Validación de entrada del usuario
- ✅ Manejo de errores de API

### ⚠️ Consideraciones Importantes
- 🔐 **API Key**: Nunca hardcodees la API key en el código
- 🌐 **HTTPS**: Usa HTTPS en producción para proteger las comunicaciones
- 🔒 **Validación**: El chatbot valida entradas pero confía en OpenAI para el contenido

## 🐛 Solución de Problemas

### Problema: "El bot no responde"
```javascript
// Verificar en consola del navegador:
console.log(hasApiKey()); // ¿Hay API key?
console.log(getApiKey()); // ¿Es válida?
```

### Problema: "Error 401 con OpenAI"
- ✅ Verificar que tu API key sea válida
- ✅ Verificar que tengas créditos en OpenAI
- ✅ Escribir "configurar api" para reconfigurar

### Problema: "GitHub elimina mi API key"
- ✅ Usar el sistema de input del usuario
- ✅ Verificar que `.gitignore` esté configurado
- ✅ No hardcodear nunca la API key

## 📄 Licencia

MIT License - Puedes usar este proyecto libremente.

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- 📧 **Email**: tu@email.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/print-copy-chatbot/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/print-copy-chatbot/discussions)

---

**Desarrollado con ❤️ para Print & Copy**
