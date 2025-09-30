// Simulador de precios por plan con localStorage y DOM dinámico

// Array de planes disponibles
const planes = [
  { id: '60-500', nombre: 'Plan Básico', horas: 60, precio: 500, descripcion: 'Ideal para proyectos pequeños' },
  { id: '120-700', nombre: 'Plan Estándar', horas: 120, precio: 700, descripcion: 'Perfecto para proyectos medianos' },
  { id: '180-1350', nombre: 'Plan Premium', horas: 180, precio: 1350, descripcion: 'Para proyectos grandes y complejos' }
];

// Recuperar simulaciones del localStorage o inicializar vacío
let simulaciones = JSON.parse(localStorage.getItem("simulaciones")) || [];

// Formateadores
const fmtCurrency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const fmtNumber = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

// Elementos del DOM
const form = document.getElementById('paramsForm');
const resultEl = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');
const planSelect = document.getElementById('plan');
const hoursInput = document.getElementById('hoursNeeded');
const pricePerHourInput = document.getElementById('pricePerHour');
const totalUSDInput = document.getElementById('totalUSD');

// Función para calcular tarifa por hora
function calcularTarifaPorHora(plan) {
  if (!plan) return null;
  return plan.precio / plan.horas;
}

// Función para calcular total
function calcularTotal(tarifaHora, horasNecesarias) {
  if (!Number.isFinite(tarifaHora) || !Number.isFinite(horasNecesarias)) return null;
  return tarifaHora * horasNecesarias;
}

// Función para actualizar campos derivados
function actualizarCamposDerivados() {
  const planSeleccionado = planes.find(p => p.id === planSelect.value);
  const horasNecesarias = parseInt(hoursInput.value) || 0;
  const tarifaHora = calcularTarifaPorHora(planSeleccionado);

  pricePerHourInput.value = tarifaHora ? fmtCurrency.format(tarifaHora) : '';
  totalUSDInput.value = tarifaHora && horasNecesarias ? fmtCurrency.format(calcularTotal(tarifaHora, horasNecesarias)) : '';
}

// Función para actualizar resultado
function actualizarResultado() {
  const planSeleccionado = planes.find(p => p.id === planSelect.value);
  const horasNecesarias = parseInt(hoursInput.value) || 0;
  const tarifaHora = calcularTarifaPorHora(planSeleccionado);

  if (!planSeleccionado || !tarifaHora || !horasNecesarias) {
    resultEl.textContent = 'Completa el plan y las horas válidas.';
    return;
  }

  const total = calcularTotal(tarifaHora, horasNecesarias);
  const resumen = `📊 SIMULACIÓN CALCULADA\n\n` +
    `Plan: ${planSeleccionado.nombre}\n` +
    `Horas base: ${fmtNumber.format(planSeleccionado.horas)} hs/mes\n` +
    `Precio base: ${fmtCurrency.format(planSeleccionado.precio)}\n` +
    `Tarifa por hora: ${fmtCurrency.format(tarifaHora)}\n` +
    `Horas solicitadas: ${fmtNumber.format(horasNecesarias)} hs\n` +
    `Total estimado: ${fmtCurrency.format(total)}\n\n` +
    `💡 ${planSeleccionado.descripcion}`;

  resultEl.textContent = resumen;
}

// Función para agregar simulación al historial
function agregarSimulacion(plan, horas, tarifa, total) {
  const simulacion = {
    id: Date.now(),
    fecha: new Date().toLocaleString('es-AR'),
    plan: plan.nombre,
    horasBase: plan.horas,
    precioBase: plan.precio,
    horasSolicitadas: horas,
    tarifaHora: tarifa,
    total: total
  };

  simulaciones.unshift(simulacion); // Agregar al inicio
  
  // Mantener solo las últimas 20 simulaciones
  if (simulaciones.length > 20) {
    simulaciones = simulaciones.slice(0, 20);
  }

  guardarSimulaciones();
  imprimirHistorialEnHTML();
}

// Función para guardar simulaciones en localStorage
function guardarSimulaciones() {
  localStorage.setItem("simulaciones", JSON.stringify(simulaciones));
}

// Función para imprimir historial en HTML
function imprimirHistorialEnHTML() {
  // Crear o actualizar sección de historial
  let historialSection = document.getElementById('historial-section');
  
  if (!historialSection) {
    historialSection = document.createElement('section');
    historialSection.id = 'historial-section';
    historialSection.innerHTML = '<h2>📚 Historial de Simulaciones</h2><div id="historial-container"></div>';
    document.body.appendChild(historialSection);
  }

  const contenedor = document.getElementById('historial-container');
  contenedor.innerHTML = '';

  if (simulaciones.length === 0) {
    contenedor.innerHTML = '<p>No hay simulaciones guardadas</p>';
    return;
  }

  simulaciones.forEach(sim => {
    const div = document.createElement('div');
    div.classList.add('historial-item');
    div.innerHTML = `
      <h4>${sim.plan} - ${sim.fecha}</h4>
      <p>${fmtNumber.format(sim.horasSolicitadas)} hs → ${fmtCurrency.format(sim.total)}</p>
      <button onclick="cargarSimulacion(${sim.id})" class="btn-cargar">Cargar</button>
      <button onclick="eliminarSimulacion(${sim.id})" class="btn-eliminar">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
}

// Función para cargar una simulación
function cargarSimulacion(id) {
  const simulacion = simulaciones.find(s => s.id === id);
  if (!simulacion) return;

  // Buscar el plan correspondiente
  const plan = planes.find(p => p.nombre === simulacion.plan);
  if (plan) {
    planSelect.value = plan.id;
    hoursInput.value = simulacion.horasSolicitadas;
    actualizarCamposDerivados();
    actualizarResultado();
  }
}

// Función para eliminar una simulación
function eliminarSimulacion(id) {
  if (confirm('¿Estás seguro de que quieres eliminar esta simulación?')) {
    simulaciones = simulaciones.filter(s => s.id !== id);
    guardarSimulaciones();
    imprimirHistorialEnHTML();
  }
}

// Event Listeners
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const planSeleccionado = planes.find(p => p.id === planSelect.value);
  const horasNecesarias = parseInt(hoursInput.value) || 0;
  const tarifaHora = calcularTarifaPorHora(planSeleccionado);
  const total = calcularTotal(tarifaHora, horasNecesarias);

  if (planSeleccionado && tarifaHora && horasNecesarias) {
    actualizarResultado();
    agregarSimulacion(planSeleccionado, horasNecesarias, tarifaHora, total);
  }
});

planSelect?.addEventListener('change', () => {
  actualizarCamposDerivados();
});

hoursInput?.addEventListener('input', () => {
  actualizarCamposDerivados();
});

resetBtn?.addEventListener('click', () => {
  form?.reset();
  pricePerHourInput.value = '';
  totalUSDInput.value = '';
  resultEl.textContent = '—';
  planSelect?.focus();
});

// Inicializar
actualizarCamposDerivados();
resultEl.textContent = '—';
imprimirHistorialEnHTML();
