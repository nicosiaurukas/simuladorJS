/**
 * Simulador de Servicios Profesionales
 * Aplicación interactiva para cotizar servicios de desarrollo de software
 * 
 * Características:
 * - Carga de datos remotos desde JSON
 * - Interfaz moderna con SweetAlert2
 * - Gráficos con Chart.js
 * - Almacenamiento local de historial
 * - Cálculos dinámicos en tiempo real
 */

class ServiceSimulator {
    constructor() {
        this.plans = [];
        this.services = [];
        this.currencies = {};
        this.discounts = {};
        this.quotes = [];
        this.currentQuote = null;
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            this.showLoading(true);
            await this.loadData();
            this.setupEventListeners();
            this.populateFormOptions();
            this.loadHistory();
            this.showLoading(false);
        } catch (error) {
            this.handleError('Error al inicializar la aplicación', error);
        }
    }

    /**
     * Carga datos remotos desde archivos JSON
     */
    async loadData() {
        try {
            const [plansResponse, servicesResponse] = await Promise.all([
                fetch('./data/plans.json'),
                fetch('./data/services.json')
            ]);

            if (!plansResponse.ok || !servicesResponse.ok) {
                throw new Error('Error al cargar los datos');
            }

            const plansData = await plansResponse.json();
            const servicesData = await servicesResponse.json();

            this.plans = plansData.plans;
            this.currencies = plansData.currencies;
            this.discounts = plansData.discounts;
            this.services = servicesData.services;

        } catch (error) {
            throw new Error('No se pudieron cargar los datos. Verifica que los archivos JSON estén disponibles.');
        }
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Form elements
        document.getElementById('projectForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('planSelect').addEventListener('change', (e) => this.handlePlanChange(e));
        document.getElementById('serviceType').addEventListener('change', (e) => this.handleServiceChange(e));
        document.getElementById('hoursNeeded').addEventListener('input', (e) => this.handleHoursChange(e));
        document.getElementById('billingPeriod').addEventListener('change', (e) => this.handleBillingChange(e));
        document.getElementById('currency').addEventListener('change', (e) => this.handleCurrencyChange(e));
        document.getElementById('rushOrder').addEventListener('change', (e) => this.handleRushOrderChange(e));
        document.getElementById('maintenance').addEventListener('change', (e) => this.handleMaintenanceChange(e));

        // Action buttons
        document.getElementById('resetForm').addEventListener('click', () => this.resetForm());
        document.getElementById('saveQuote').addEventListener('click', () => this.saveQuote());
        document.getElementById('exportQuote').addEventListener('click', () => this.exportQuote());
        document.getElementById('shareQuote').addEventListener('click', () => this.shareQuote());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
    }

    /**
     * Pobla las opciones del formulario
     */
    populateFormOptions() {
        // Populate plans
        const planSelect = document.getElementById('planSelect');
        this.plans.forEach(plan => {
            const option = document.createElement('option');
            option.value = plan.id;
            option.textContent = `${plan.name} - ${plan.baseHours}h/mes - $${plan.basePriceUSD}`;
            planSelect.appendChild(option);
        });

        // Populate services
        const serviceSelect = document.getElementById('serviceType');
        this.services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    }

    /**
     * Cambia entre pestañas
     */
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from all nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Load content for specific tabs
        if (tabName === 'plans') {
            this.renderPlans();
        } else if (tabName === 'history') {
            this.renderHistory();
        }
    }

    /**
     * Maneja el envío del formulario
     */
    handleFormSubmit(event) {
        event.preventDefault();
        this.calculateQuote();
    }

    /**
     * Maneja el cambio de plan
     */
    handlePlanChange(event) {
        const planId = event.target.value;
        const plan = this.plans.find(p => p.id === planId);
        
        if (plan) {
            this.showPlanDetails(plan);
            this.updateCalculations();
        }
    }

    /**
     * Maneja el cambio de servicio
     */
    handleServiceChange(event) {
        this.updateCalculations();
    }

    /**
     * Maneja el cambio de horas
     */
    handleHoursChange(event) {
        this.updateCalculations();
    }

    /**
     * Maneja el cambio de período de facturación
     */
    handleBillingChange(event) {
        this.updateCalculations();
    }

    /**
     * Maneja el cambio de moneda
     */
    handleCurrencyChange(event) {
        this.updateCalculations();
    }

    /**
     * Maneja el cambio de proyecto urgente
     */
    handleRushOrderChange(event) {
        this.updateCalculations();
    }

    /**
     * Maneja el cambio de mantenimiento
     */
    handleMaintenanceChange(event) {
        this.updateCalculations();
    }

    /**
     * Muestra los detalles del plan seleccionado
     */
    showPlanDetails(plan) {
        const detailsContainer = document.getElementById('planDetails');
        detailsContainer.innerHTML = `
            <h4>${plan.name}</h4>
            <p>${plan.description}</p>
            <ul class="plan-features">
                ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
        detailsContainer.classList.add('active');
    }

    /**
     * Actualiza los cálculos en tiempo real
     */
    updateCalculations() {
        const formData = this.getFormData();
        if (formData.plan && formData.service && formData.hours) {
            this.calculateQuote(formData);
        }
    }

    /**
     * Obtiene los datos del formulario
     */
    getFormData() {
        return {
            plan: this.plans.find(p => p.id === document.getElementById('planSelect').value),
            service: this.services.find(s => s.id === document.getElementById('serviceType').value),
            hours: parseInt(document.getElementById('hoursNeeded').value) || 0,
            billingPeriod: document.getElementById('billingPeriod').value,
            currency: document.getElementById('currency').value,
            rushOrder: document.getElementById('rushOrder').checked,
            maintenance: document.getElementById('maintenance').checked
        };
    }

    /**
     * Calcula la cotización
     */
    calculateQuote(formData = null) {
        if (!formData) {
            formData = this.getFormData();
        }

        if (!formData.plan || !formData.service || !formData.hours) {
            this.showError('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            // Cálculo base
            const baseHourlyRate = formData.plan.basePriceUSD / formData.plan.baseHours;
            const serviceMultiplier = formData.service.baseRate;
            const adjustedHourlyRate = baseHourlyRate * serviceMultiplier;

            // Aplicar descuentos por período
            const discountRate = this.discounts[formData.billingPeriod] || 0;
            const discountedRate = adjustedHourlyRate * (1 - discountRate);

            // Aplicar recargo por urgencia
            const rushMultiplier = formData.rushOrder ? 1.2 : 1;
            const finalHourlyRate = discountedRate * rushMultiplier;

            // Calcular total
            const subtotal = finalHourlyRate * formData.hours;
            const discountAmount = subtotal * discountRate;
            const rushSurcharge = formData.rushOrder ? subtotal * 0.2 : 0;

            // Agregar mantenimiento si está seleccionado
            const maintenanceCost = formData.maintenance ? subtotal * 0.15 : 0;
            const total = subtotal - discountAmount + rushSurcharge + maintenanceCost;

            // Convertir a moneda seleccionada
            const exchangeRate = this.currencies[formData.currency] || 1;
            const convertedTotal = total * exchangeRate;

            // Crear objeto de cotización
            this.currentQuote = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                plan: formData.plan,
                service: formData.service,
                hours: formData.hours,
                billingPeriod: formData.billingPeriod,
                currency: formData.currency,
                rushOrder: formData.rushOrder,
                maintenance: formData.maintenance,
                calculations: {
                    baseHourlyRate,
                    serviceMultiplier,
                    adjustedHourlyRate,
                    discountRate,
                    discountedRate,
                    finalHourlyRate,
                    subtotal,
                    discountAmount,
                    rushSurcharge,
                    maintenanceCost,
                    total,
                    exchangeRate,
                    convertedTotal
                }
            };

            this.renderQuote();
            this.updateChart();

        } catch (error) {
            this.handleError('Error al calcular la cotización', error);
        }
    }

    /**
     * Renderiza la cotización
     */
    renderQuote() {
        if (!this.currentQuote) return;

        const { calculations, plan, service, hours, currency, billingPeriod, rushOrder, maintenance } = this.currentQuote;
        const currencySymbol = this.getCurrencySymbol(currency);

        const resultsHTML = `
            <div class="result-item">
                <span class="result-label">Plan Base:</span>
                <span class="result-value">${plan.name} (${plan.baseHours}h/mes)</span>
            </div>
            <div class="result-item">
                <span class="result-label">Servicio:</span>
                <span class="result-value">${service.name}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Horas Solicitadas:</span>
                <span class="result-value">${hours.toLocaleString()} horas</span>
            </div>
            <div class="result-item">
                <span class="result-label">Tarifa Base por Hora:</span>
                <span class="result-value">${currencySymbol}${calculations.baseHourlyRate.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Multiplicador de Servicio:</span>
                <span class="result-value">${(calculations.serviceMultiplier * 100).toFixed(0)}%</span>
            </div>
            ${calculations.discountRate > 0 ? `
            <div class="result-item">
                <span class="result-label">Descuento por ${this.getBillingPeriodName(billingPeriod)}:</span>
                <span class="result-value">-${currencySymbol}${calculations.discountAmount.toFixed(2)}</span>
            </div>
            ` : ''}
            ${rushOrder ? `
            <div class="result-item">
                <span class="result-label">Recargo por Urgencia:</span>
                <span class="result-value">+${currencySymbol}${calculations.rushSurcharge.toFixed(2)}</span>
            </div>
            ` : ''}
            ${maintenance ? `
            <div class="result-item">
                <span class="result-label">Mantenimiento (6 meses):</span>
                <span class="result-value">+${currencySymbol}${calculations.maintenanceCost.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="result-item">
                <span class="result-label"><strong>TOTAL ESTIMADO:</strong></span>
                <span class="result-value"><strong>${currencySymbol}${calculations.convertedTotal.toFixed(2)}</strong></span>
            </div>
        `;

        document.getElementById('calculationResults').innerHTML = resultsHTML;
        document.getElementById('resultActions').style.display = 'flex';
    }

    /**
     * Actualiza el gráfico
     */
    updateChart() {
        if (!this.currentQuote) return;

        const ctx = document.getElementById('costChart').getContext('2d');
        const { calculations } = this.currentQuote;
        const currencySymbol = this.getCurrencySymbol(this.currentQuote.currency);

        // Destroy existing chart if it exists
        if (window.costChart) {
            window.costChart.destroy();
        }

        window.costChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Subtotal',
                    ...(calculations.discountAmount > 0 ? ['Descuento'] : []),
                    ...(this.currentQuote.rushOrder ? ['Recargo Urgencia'] : []),
                    ...(this.currentQuote.maintenance ? ['Mantenimiento'] : [])
                ],
                datasets: [{
                    data: [
                        calculations.subtotal,
                        ...(calculations.discountAmount > 0 ? [-calculations.discountAmount] : []),
                        ...(this.currentQuote.rushOrder ? [calculations.rushSurcharge] : []),
                        ...(this.currentQuote.maintenance ? [calculations.maintenanceCost] : [])
                    ],
                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + currencySymbol + Math.abs(context.parsed).toFixed(2);
                            }
                        }
                    }
                }
            }
        });

        document.querySelector('.chart-container').classList.add('active');
    }

    /**
     * Guarda la cotización
     */
    saveQuote() {
        if (!this.currentQuote) {
            this.showError('No hay cotización para guardar');
            return;
        }

        this.quotes.push({ ...this.currentQuote });
        this.saveHistory();
        
        Swal.fire({
            title: '¡Cotización Guardada!',
            text: 'La cotización se ha guardado en el historial',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    /**
     * Exporta la cotización
     */
    exportQuote() {
        if (!this.currentQuote) {
            this.showError('No hay cotización para exportar');
            return;
        }

        // Simular exportación a PDF
        Swal.fire({
            title: 'Exportar Cotización',
            text: '¿Deseas exportar la cotización como PDF?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, exportar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '¡Exportación Exitosa!',
                    text: 'La cotización se ha exportado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        });
    }

    /**
     * Comparte la cotización
     */
    shareQuote() {
        if (!this.currentQuote) {
            this.showError('No hay cotización para compartir');
            return;
        }

        const shareText = `Cotización de ${this.currentQuote.service.name}: ${this.getCurrencySymbol(this.currentQuote.currency)}${this.currentQuote.calculations.convertedTotal.toFixed(2)}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Cotización de Servicios',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            navigator.clipboard.writeText(shareText).then(() => {
                Swal.fire({
                    title: '¡Enlace Copiado!',
                    text: 'La cotización se ha copiado al portapapeles',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            });
        }
    }

    /**
     * Resetea el formulario
     */
    resetForm() {
        Swal.fire({
            title: '¿Limpiar Formulario?',
            text: 'Se perderán todos los datos ingresados',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('projectForm').reset();
                document.getElementById('planDetails').classList.remove('active');
                document.getElementById('calculationResults').innerHTML = `
                    <div class="result-placeholder">
                        <i class="fas fa-calculator"></i>
                        <p>Completa el formulario para ver la cotización</p>
                    </div>
                `;
                document.getElementById('resultActions').style.display = 'none';
                document.querySelector('.chart-container').classList.remove('active');
                this.currentQuote = null;
            }
        });
    }

    /**
     * Renderiza los planes disponibles
     */
    renderPlans() {
        const plansGrid = document.getElementById('plansGrid');
        plansGrid.innerHTML = this.plans.map(plan => `
            <div class="plan-card ${plan.popular ? 'popular' : ''}">
                <h3>${plan.name}</h3>
                <div class="price">$${plan.basePriceUSD}</div>
                <p class="description">${plan.description}</p>
                <ul class="plan-features">
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="plan-info">
                    <p><strong>Horas incluidas:</strong> ${plan.baseHours}/mes</p>
                    <p><strong>Precio por hora:</strong> $${(plan.basePriceUSD / plan.baseHours).toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza el historial
     */
    renderHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.quotes.length === 0) {
            historyList.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-history" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 15px;"></i>
                    <p style="color: var(--text-muted);">No hay cotizaciones guardadas</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = this.quotes.map(quote => `
            <div class="history-item">
                <h4>${quote.service.name} - ${quote.plan.name}</h4>
                <div class="date">${new Date(quote.timestamp).toLocaleString()}</div>
                <div class="summary">
                    <span>${quote.hours} horas</span>
                    <span><strong>${this.getCurrencySymbol(quote.currency)}${quote.calculations.convertedTotal.toFixed(2)}</strong></span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Limpia el historial
     */
    clearHistory() {
        Swal.fire({
            title: '¿Limpiar Historial?',
            text: 'Se eliminarán todas las cotizaciones guardadas',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444'
        }).then((result) => {
            if (result.isConfirmed) {
                this.quotes = [];
                this.saveHistory();
                this.renderHistory();
                Swal.fire({
                    title: '¡Historial Limpiado!',
                    text: 'Todas las cotizaciones han sido eliminadas',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        });
    }

    /**
     * Carga el historial desde localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('serviceSimulatorHistory');
            if (saved) {
                this.quotes = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Error al cargar el historial:', error);
        }
    }

    /**
     * Guarda el historial en localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('serviceSimulatorHistory', JSON.stringify(this.quotes));
        } catch (error) {
            console.warn('Error al guardar el historial:', error);
        }
    }

    /**
     * Muestra/oculta el overlay de carga
     */
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    /**
     * Maneja errores de la aplicación
     */
    handleError(message, error) {
        console.error(message, error);
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    /**
     * Muestra un error simple
     */
    showError(message) {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    /**
     * Obtiene el símbolo de la moneda
     */
    getCurrencySymbol(currency) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'ARS': '$',
            'BRL': 'R$'
        };
        return symbols[currency] || '$';
    }

    /**
     * Obtiene el nombre del período de facturación
     */
    getBillingPeriodName(period) {
        const names = {
            'monthly': 'Facturación Mensual',
            'quarterly': 'Facturación Trimestral',
            'semiannual': 'Facturación Semestral',
            'annual': 'Facturación Anual'
        };
        return names[period] || period;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ServiceSimulator();
});
