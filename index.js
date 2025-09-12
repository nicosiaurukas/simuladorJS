// Simulador de precios por plan: 60hs=USD500, 120hs=USD700, 180hs=USD1350

const form = document.getElementById('paramsForm');
const resultEl = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');

const planSelect = document.getElementById('plan');
const hoursInput = document.getElementById('hoursNeeded');
const pricePerHourInput = document.getElementById('pricePerHour');
const totalUSDInput = document.getElementById('totalUSD');

// Datos base (arrays y constantes)
const plans = [
	{ id: '60-500', label: '60 hs / mes — USD 500', baseHours: 60, basePriceUSD: 500 },
	{ id: '120-700', label: '120 hs / mes — USD 700', baseHours: 120, basePriceUSD: 700 },
	{ id: '180-1350', label: '180 hs / mes — USD 1350', baseHours: 180, basePriceUSD: 1350 },
];

function findPlanById(id) {
	for (const plan of plans) {
		if (plan.id === id) return plan;
	}
	return null;
}

function parsePlan(value) {
	// value ej: "60-500"
	if (typeof value !== 'string') return null;
	const [hoursStr, priceStr] = value.split('-');
	const hours = Number(hoursStr);
	const price = Number(priceStr);
	if (!Number.isFinite(hours) || !Number.isFinite(price) || hours <= 0 || price <= 0) return null;
	return { baseHours: hours, basePriceUSD: price };
}

function parseIntSafe(value) {
	const n = Number.parseInt(String(value), 10);
	return Number.isFinite(n) && n > 0 ? n : null;
}

const fmtCurrency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const fmtNumber = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

function computeHourlyRateUSD(plan) {
	if (!plan) return null;
	return plan.basePriceUSD / plan.baseHours;
}

function computeTotalUSD(hourlyRate, hoursNeeded) {
	if (!Number.isFinite(hourlyRate) || !Number.isFinite(hoursNeeded)) return null;
	return hourlyRate * hoursNeeded;
}

function updateDerivedFields() {
	const plan = parsePlan(planSelect?.value);
	const hoursNeeded = parseIntSafe(hoursInput?.value);
	const hourly = computeHourlyRateUSD(plan);

	pricePerHourInput.value = hourly ? fmtCurrency.format(hourly) : '';
	totalUSDInput.value = hourly && hoursNeeded ? fmtCurrency.format(computeTotalUSD(hourly, hoursNeeded)) : '';
}

function updateResultSummary() {
	const plan = parsePlan(planSelect?.value);
	const hoursNeeded = parseIntSafe(hoursInput?.value);
	const hourly = computeHourlyRateUSD(plan);
	if (!plan || !hourly || !hoursNeeded) {
		resultEl.textContent = 'Completa el plan y las horas válidas.';
		return;
	}
	const total = computeTotalUSD(hourly, hoursNeeded);
	const summary = `Plan base: ${fmtNumber.format(plan.baseHours)} hs por ${fmtCurrency.format(plan.basePriceUSD)} (USD ${fmtCurrency.format(hourly)} / hs).\n` +
		`Horas solicitadas: ${fmtNumber.format(hoursNeeded)} hs.\n` +
		`Total estimado: ${fmtCurrency.format(total)}.`;
	resultEl.textContent = summary;
}

// --- Flujo por consola con prompt/confirm/alert ---
function buildPlansMenuText() {
	let lines = ['Elegí un plan base (ingresá 60, 120 o 180):'];
	for (const p of plans) {
		const hourly = computeHourlyRateUSD(p);
		lines.push(`- ${p.baseHours} hs → ${fmtCurrency.format(p.basePriceUSD)} (≈ ${fmtCurrency.format(hourly)}/hs)`);
	}
	return lines.join('\n');
}

function promptForPlanBaseHours() {
	// Repite hasta recibir 60, 120 o 180 o cancelación
	while (true) {
		const input = prompt(buildPlansMenuText());
		if (input === null) return null; // cancelado
		const normalized = String(input).trim();
		if (normalized === '60' || normalized === '120' || normalized === '180') {
			return Number(normalized);
		}
		alert('Entrada inválida. Por favor ingresá 60, 120 o 180.');
	}
}

function promptForHoursNeeded() {
	while (true) {
		const input = prompt('¿Cuántas horas necesitás? (número entero > 0)');
		if (input === null) return null; // cancelado
		const n = parseIntSafe(input);
		if (n !== null) return n;
		alert('Entrada inválida. Ingresá un número entero mayor a 0.');
	}
}

function runConsoleSimulator() {
	console.clear();
	console.log('Simulador de precios (flujo por consola)');
	console.table(plans.map(p => ({ plan: p.label, horas: p.baseHours, precioUSD: p.basePriceUSD, usdPorHora: (p.basePriceUSD / p.baseHours) })));

	const proceed = confirm('¿Querés usar el simulador por consola con cuadros de diálogo?');
	if (!proceed) {
		console.log('El usuario decidió no usar el flujo por consola.');
		return;
	}

	const baseHours = promptForPlanBaseHours();
	if (baseHours === null) {
		alert('Operación cancelada.');
		console.warn('Operación cancelada en selección de plan.');
		return;
	}
	const plan = plans.find(p => p.baseHours === baseHours);
	const hourly = computeHourlyRateUSD(plan);

	const hoursNeeded = promptForHoursNeeded();
	if (hoursNeeded === null) {
		alert('Operación cancelada.');
		console.warn('Operación cancelada al ingresar horas.');
		return;
	}

	const total = computeTotalUSD(hourly, hoursNeeded);
	const summary = `Plan base: ${plan.baseHours} hs por ${fmtCurrency.format(plan.basePriceUSD)} (≈ ${fmtCurrency.format(hourly)}/hs)\n` +
		`Horas solicitadas: ${fmtNumber.format(hoursNeeded)} hs\n` +
		`Total estimado: ${fmtCurrency.format(total)}`;

	console.log('Resumen de simulación');
	console.log(summary);
	alert(summary);
}

form?.addEventListener('submit', (event) => {
	event.preventDefault();
	updateDerivedFields();
	updateResultSummary();
});

planSelect?.addEventListener('change', () => {
	updateDerivedFields();
});

hoursInput?.addEventListener('input', () => {
	updateDerivedFields();
});

resetBtn?.addEventListener('click', () => {
	form?.reset();
	pricePerHourInput.value = '';
	totalUSDInput.value = '';
	resultEl.textContent = '—';
	planSelect?.focus();
});

// Estado inicial: calcular a partir del valor por defecto del plan
updateDerivedFields();
resultEl.textContent = '—';

// Lanzar flujo de consola (opcional) al cargar
// Se ejecuta tras un pequeño delay para permitir que cargue el DOM
setTimeout(runConsoleSimulator, 0);
