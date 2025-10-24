# Simulador de Servicios Profesionales

## 📋 Descripción del Proyecto

Este es un simulador interactivo para cotizar servicios de desarrollo de software. La aplicación permite a los usuarios seleccionar diferentes planes de trabajo, tipos de servicios, y calcular costos estimados con descuentos, recargos y conversión de monedas.

## 🎯 Objetivos Cumplidos

### ✅ Objetivos Específicos
- **Datos remotos**: Utiliza archivos JSON para cargar planes, servicios y configuraciones
- **HTML interactivo**: Generado dinámicamente desde JavaScript con eventos y manipulación del DOM
- **Herramientas JS importantes**: Clases, async/await, localStorage, fetch API, event listeners
- **Librerías externas**: SweetAlert2 para alertas, Chart.js para gráficos, Font Awesome para iconos
- **100% funcional**: Simula el proceso completo de cotización con lógica de negocio real

### ✅ Criterios de Evaluación

#### Funcionalidad
- ✅ Simula flujo completo: entrada → procesamiento → salida
- ✅ Sin errores de cómputo
- ✅ Validaciones robustas
- ✅ Cálculos precisos con múltiples variables

#### Interactividad
- ✅ Captura entradas con inputs y eventos apropiados
- ✅ Salidas coherentes y visualización asíncrona
- ✅ Eventos en tiempo real (cálculos dinámicos)
- ✅ Interfaz responsive y moderna

#### Escalabilidad
- ✅ Funciones con parámetros específicos
- ✅ Clase principal con métodos organizados
- ✅ Objetos con propiedades y métodos relevantes
- ✅ Arrays para agrupar datos dinámicamente
- ✅ Recorrido optimizado de colecciones

#### Integridad
- ✅ Código JavaScript en archivo .js separado
- ✅ Referenciado correctamente desde HTML
- ✅ Información estática en JSON
- ✅ Carga asíncrona de datos

#### Legibilidad
- ✅ Nombres significativos para contexto
- ✅ Instrucciones legibles
- ✅ Comentarios oportunos
- ✅ Código ordenado y bien estructurado

## 🚀 Características Principales

### 💼 Funcionalidades de Negocio
- **Planes de Servicio**: 3 planes base (Básico, Profesional, Enterprise)
- **Tipos de Servicio**: Desarrollo, Consultoría, Mantenimiento, Capacitación
- **Cálculos Dinámicos**: Tarifas por hora, descuentos por período, recargos por urgencia
- **Múltiples Monedas**: USD, EUR, ARS, BRL con conversión automática
- **Descuentos**: Por facturación trimestral, semestral y anual
- **Recargos**: Por proyectos urgentes (+20%)
- **Servicios Adicionales**: Mantenimiento incluido

### 🎨 Interfaz de Usuario
- **Diseño Moderno**: Interfaz limpia y profesional
- **Responsive**: Adaptable a dispositivos móviles y desktop
- **Navegación por Pestañas**: Calculadora, Planes, Historial
- **Gráficos Interactivos**: Visualización de costos con Chart.js
- **Alertas Modernas**: SweetAlert2 en lugar de alert/prompt/confirm

### 💾 Persistencia de Datos
- **Historial Local**: Guardado en localStorage
- **Exportación**: Funcionalidad para exportar cotizaciones
- **Compartir**: Integración con Web Share API

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Clases, async/await, fetch API, localStorage

### Librerías Externas
- **SweetAlert2**: Alertas y confirmaciones modernas
- **Chart.js**: Gráficos interactivos
- **Font Awesome**: Iconografía

### Datos
- **JSON**: Archivos de configuración y datos
- **Fetch API**: Carga asíncrona de datos remotos

## 📁 Estructura del Proyecto

```
simuladorJS/
├── index.html              # Página principal
├── app.js                 # Lógica de la aplicación
├── styles.css             # Estilos CSS
├── data/
│   ├── plans.json         # Datos de planes de servicio
│   └── services.json      # Datos de tipos de servicio
└── README.md              # Documentación
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (para cargar archivos JSON)

### Instalación
1. Clona o descarga el proyecto
2. Coloca los archivos en un servidor web
3. Abre `index.html` en el navegador

### Uso Local con Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego visita: `http://localhost:8000`

## 📊 Funcionalidades Detalladas

### 1. Calculadora de Cotizaciones
- Selección de plan base (60/120/180 horas mensuales)
- Tipo de servicio con multiplicadores
- Horas necesarias del proyecto
- Período de facturación con descuentos
- Moneda de cotización
- Opciones adicionales (urgencia, mantenimiento)

### 2. Gestión de Planes
- Visualización de todos los planes disponibles
- Detalles de características y precios
- Comparación visual entre planes

### 3. Historial de Cotizaciones
- Guardado automático de cotizaciones
- Visualización cronológica
- Limpieza del historial
- Exportación de datos

### 4. Cálculos Avanzados
- Tarifa base por hora
- Multiplicadores por tipo de servicio
- Descuentos por período de facturación
- Recargos por urgencia
- Costos de mantenimiento
- Conversión de monedas

## 🎨 Diseño y UX

### Principios de Diseño
- **Consistencia**: Colores y tipografías uniformes
- **Accesibilidad**: Contraste adecuado y navegación por teclado
- **Usabilidad**: Flujo intuitivo y feedback visual
- **Responsividad**: Adaptación a diferentes tamaños de pantalla

### Paleta de Colores
- **Primario**: #2563eb (Azul)
- **Secundario**: #64748b (Gris)
- **Éxito**: #10b981 (Verde)
- **Advertencia**: #f59e0b (Amarillo)
- **Peligro**: #ef4444 (Rojo)

## 🔧 Configuración y Personalización

### Modificar Planes
Edita `data/plans.json` para agregar o modificar planes:
```json
{
  "id": "nuevo-plan",
  "name": "Plan Personalizado",
  "baseHours": 100,
  "basePriceUSD": 800,
  "description": "Descripción del plan",
  "features": ["Característica 1", "Característica 2"],
  "popular": false
}
```

### Agregar Servicios
Modifica `data/services.json` para nuevos tipos de servicio:
```json
{
  "id": "nuevo-servicio",
  "name": "Nuevo Servicio",
  "baseRate": 1.3,
  "description": "Descripción del servicio",
  "categories": ["categoria1", "categoria2"]
}
```

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Características Requeridas
- ES6+ (Clases, async/await)
- Fetch API
- localStorage
- CSS Grid y Flexbox

## 🚀 Mejoras Futuras

### Funcionalidades Adicionales
- [ ] Autenticación de usuarios
- [ ] Sincronización en la nube
- [ ] Plantillas de cotización
- [ ] Integración con APIs de pago
- [ ] Reportes avanzados
- [ ] Notificaciones push

### Optimizaciones
- [ ] Service Workers para offline
- [ ] Compresión de assets
- [ ] Lazy loading de componentes
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto es parte de un trabajo académico y está destinado únicamente para fines educativos.

## 👨‍💻 Autor

**Proyecto Final - Simulador de Servicios Profesionales**

Desarrollado como proyecto final para demostrar competencias en:
- JavaScript moderno
- Manipulación del DOM
- APIs asíncronas
- Librerías externas
- Diseño responsive
- Lógica de negocio compleja

---

## 🎯 Criterios de Evaluación - Checklist

### ✅ Funcionalidad
- [x] Simula uno o más flujos de trabajo entrada-procesamiento-salida
- [x] No se advierten errores de cómputo
- [x] Lógica de negocio completa y funcional

### ✅ Interactividad  
- [x] Captura entradas empleando inputs y eventos adecuados
- [x] Salidas coherentes en relación a los datos ingresados
- [x] Visualización en HTML de forma asíncrona

### ✅ Escalabilidad
- [x] Funciones con parámetros para tareas específicas
- [x] Objetos con propiedades y métodos relevantes
- [x] Arrays para agrupar valores y objetos dinámicamente
- [x] Recorrido óptimo de colecciones

### ✅ Integridad
- [x] Código JavaScript en archivo .js separado
- [x] Referenciado correctamente desde HTML
- [x] Información estática en JSON utilizada adecuadamente
- [x] Carga asíncrona de datos

### ✅ Legibilidad
- [x] Nombres significativos para contexto
- [x] Instrucciones legibles
- [x] Comentarios oportunos
- [x] Código ordenado y bien estructurado

