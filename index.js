// Simulador de precios por plan: 60hs=USD500, 120hs=USD700, 180hs=USD1350

const form = document.getElementById('paramsForm');
const resultEl = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');

const planSelect = document.getElementById('plan');
const hoursInput = document.getElementById('hoursNeeded');
const pricePerHourInput = document.getElementById('pricePerHour');
const totalUSDInput = document.getElementById('totalUSD');

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
