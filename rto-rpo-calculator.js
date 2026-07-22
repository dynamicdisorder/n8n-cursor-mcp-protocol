// RTO/RPO Impact Calculator - TechImpact.online
class RTORPOCalculator {
    constructor() {
        this.currentLanguage = 'en';
        this.strings = this.initializeStrings();
        this.scenarioMap = {
            rto: 'rto-target',
            rpo: 'rpo-target',
            freq: 'incident-frequency',
            rev: 'revenue-per-hour',
            data: 'data-recreation-cost',
            cur: 'currency'
        };
        this.initializeEventListeners();
        this.initializeCounters();
        this.loadScenarioFromUrl();
        this.calculateRisk();
        
        console.log('🚀 RTO/RPO Impact Calculator initialized successfully');
    }

    initializeStrings() {
        return {
            en: {
                'nav.product': 'Product',
                'nav.pricing': 'Pricing',
                'nav.resources': 'Resources',
                'nav.blog': 'Blog',
                'header.get-started': 'Get Started',
                'hero.title1': 'Assess Your Disaster Recovery',
                'hero.title2': 'RTO/RPO Impact',
                'hero.subtitle': 'Calculate the financial impact of your Recovery Time and Recovery Point objectives. Evaluate risk levels and get actionable recommendations to optimize your disaster recovery strategy.',
                'hero.start-trial': 'Start Free Trial',
                'hero.request-demo': 'Request Demo',
                'tabs.sla': 'SLA Penalty Calculator',
                'tabs.downtime': 'Website Downtime Cost',
                'tabs.rto-rpo': 'RTO/RPO Impact',
                'form.title': 'RTO/RPO Impact Calculator',
                'form.rto-target': 'RTO Target (hours)',
                'form.rto-hint': 'Maximum acceptable downtime',
                'form.rpo-target': 'RPO Target (hours)',
                'form.rpo-hint': 'Maximum acceptable data loss',
                'form.incident-frequency': 'Incident Frequency (per year)',
                'form.frequency-hint': 'How many disasters per year',
                'form.revenue-per-hour': 'Revenue per Hour',
                'form.data-recreation-cost': 'Data Recreation Cost per Hour (optional)',
                'form.data-recreation-hint': 'Cost to recreate lost data',
                'form.calculate': 'Calculate Risk',
                'form.reset': 'Reset',
                'results.title': 'Impact Analysis',
                'results.annualized-loss': 'Annualized Loss',
                'results.cost-breakdown': 'Cost Breakdown',
                'results.rto-loss': 'RTO Loss:',
                'results.rpo-cost': 'RPO Cost:',
                'results.total-impact': 'Total Impact:',
                'results.comparison': 'Target vs Risk Assessment',
                'results.rto-comparison': 'RTO',
                'results.rpo-comparison': 'RPO',
                'results.risk-level': 'Risk Level:',
                'results.risk-explanation': 'Risk is assessed based on RTO and RPO targets compared to industry standards.',
                'results.risk-low-explanation': 'Low Risk: RTO ≤1h, RPO ≤15min. Excellent disaster recovery targets.',
                'results.risk-medium-explanation': 'Medium Risk: RTO ≤4h, RPO ≤1h. Good targets with room for improvement.',
                'results.risk-high-explanation': 'High Risk: RTO >4h or RPO >4h. Significant risk exposure.',
                'results.recommendations': 'Recommendations',
                'results.default-recommendation': 'Enter your RTO and RPO targets to get personalized recommendations for improving your disaster recovery strategy.',
                'results.copy-summary': 'Copy Summary',
                'results.download-csv': 'Download CSV',
                'how-it-works.title': 'How It Works',
                'how-it-works.step1.title': 'Define Your Targets',
                'how-it-works.step1.description': 'Set your RTO and RPO targets based on business requirements and enter your revenue per hour and incident frequency.',
                'how-it-works.step2.title': 'Calculate Impact',
                'how-it-works.step2.description': 'We calculate the annualized financial impact based on your targets and assess the risk level of your current strategy.',
                'how-it-works.step3.title': 'Visualize Risk',
                'how-it-works.step3.description': 'Compare your targets against industry standards and see visual indicators of your risk exposure.',
                'how-it-works.step4.title': 'Get Recommendations',
                'how-it-works.step4.description': 'Receive actionable recommendations to improve your disaster recovery strategy and reduce business risk.',
                'stats.calculations': 'RTO/RPO Calculations',
                'stats.teams-impacted': 'Teams Impacted',
                'stats.avg-rto': 'Avg RTO (hours)',
                'stats.accuracy': 'Accuracy Rate (%)',
                'faq.title': 'Frequently Asked Questions',
                'faq.q1.question': 'What is the difference between RTO and RPO?',
                'faq.q1.answer': 'RTO (Recovery Time Objective) is the maximum acceptable time to restore service after a disaster. RPO (Recovery Point Objective) is the maximum acceptable data loss measured in time before the incident.',
                'faq.q2.question': 'Why do RTO and RPO matter for business continuity?',
                'faq.q2.answer': 'RTO and RPO directly impact business continuity costs. Longer RTO means more downtime and revenue loss. Longer RPO means more data loss and recovery costs.',
                'faq.q3.question': 'What are good RTO and RPO targets?',
                'faq.q3.answer': 'Targets depend on business criticality. Critical systems: RTO <1 hour, RPO <15 minutes. Important systems: RTO <4 hours, RPO <1 hour. Standard systems: RTO <24 hours, RPO <4 hours.',
                'faq.q4.question': 'How do I reduce my RTO and RPO?',
                'faq.q4.answer': 'Improve infrastructure redundancy, implement automated failover, use real-time replication, optimize backup strategies, and invest in disaster recovery testing and training.',
                'faq.q5.question': 'What\'s the cost of achieving lower RTO/RPO?',
                'faq.q5.answer': 'Lower RTO/RPO requires more investment in infrastructure, redundancy, and technology. The cost increases exponentially as targets get more aggressive, but so does business protection.',
                'footer.product': 'Product',
                'footer.features': 'Features',
                'footer.pricing': 'Pricing',
                'footer.integrations': 'Integrations',
                'footer.company': 'Company',
                'footer.about': 'About',
                'footer.blog': 'Blog',
                'footer.careers': 'Careers',
                'footer.support': 'Support',
                'footer.help': 'Help Center',
                'footer.contact': 'Contact',
                'footer.status': 'Status',
                'footer.legal': 'Legal',
                'footer.privacy': 'Privacy',
                'footer.terms': 'Terms',
                'footer.cookies': 'Cookies',
                'disclaimer.text': 'Estimates only. Not financial advice.'
            },
            es: {
                'nav.product': 'Producto',
                'nav.pricing': 'Precios',
                'nav.resources': 'Recursos',
                'nav.blog': 'Blog',
                'header.get-started': 'Comenzar',
                'hero.title1': 'Evalúa tu Recuperación ante Desastres',
                'hero.title2': 'Impacto RTO/RPO',
                'hero.subtitle': 'Calcula el impacto financiero de tus objetivos de Tiempo de Recuperación y Punto de Recuperación. Evalúa niveles de riesgo y obtén recomendaciones accionables para optimizar tu estrategia de recuperación ante desastres.',
                'hero.start-trial': 'Iniciar Prueba Gratuita',
                'hero.request-demo': 'Solicitar Demo',
                'tabs.sla': 'Calculadora de Penalizaciones SLA',
                'tabs.downtime': 'Costo de Tiempo de Inactividad',
                'tabs.rto-rpo': 'Impacto RTO/RPO',
                'form.title': 'Calculadora de Impacto RTO/RPO',
                'form.rto-target': 'Objetivo RTO (horas)',
                'form.rto-hint': 'Tiempo máximo aceptable de inactividad',
                'form.rpo-target': 'Objetivo RPO (horas)',
                'form.rpo-hint': 'Pérdida máxima aceptable de datos',
                'form.incident-frequency': 'Frecuencia de Incidentes (por año)',
                'form.frequency-hint': 'Cuántos desastres por año',
                'form.revenue-per-hour': 'Ingresos por Hora',
                'form.data-recreation-cost': 'Costo de Recreación de Datos por Hora (opcional)',
                'form.data-recreation-hint': 'Costo para recrear datos perdidos',
                'form.calculate': 'Calcular Riesgo',
                'form.reset': 'Reiniciar',
                'results.title': 'Análisis de Impacto',
                'results.annualized-loss': 'Pérdida Anualizada',
                'results.cost-breakdown': 'Desglose de Costos',
                'results.rto-loss': 'Pérdida RTO:',
                'results.rpo-cost': 'Costo RPO:',
                'results.total-impact': 'Impacto Total:',
                'results.comparison': 'Objetivo vs Evaluación de Riesgo',
                'results.rto-comparison': 'RTO',
                'results.rpo-comparison': 'RPO',
                'results.risk-level': 'Nivel de Riesgo:',
                'results.risk-explanation': 'El riesgo se evalúa basado en objetivos RTO y RPO comparados con estándares de la industria.',
                'results.risk-low-explanation': 'Riesgo Bajo: RTO ≤1h, RPO ≤15min. Excelentes objetivos de recuperación ante desastres.',
                'results.risk-medium-explanation': 'Riesgo Medio: RTO ≤4h, RPO ≤1h. Buenos objetivos con margen de mejora.',
                'results.risk-high-explanation': 'Riesgo Alto: RTO >4h o RPO >4h. Exposición significativa al riesgo.',
                'results.recommendations': 'Recomendaciones',
                'results.default-recommendation': 'Ingresa tus objetivos RTO y RPO para obtener recomendaciones personalizadas para mejorar tu estrategia de recuperación ante desastres.',
                'results.copy-summary': 'Copiar Resumen',
                'results.download-csv': 'Descargar CSV',
                'how-it-works.title': 'Cómo Funciona',
                'how-it-works.step1.title': 'Define tus Objetivos',
                'how-it-works.step1.description': 'Establece tus objetivos RTO y RPO basados en los requisitos del negocio e ingresa tus ingresos por hora y frecuencia de incidentes.',
                'how-it-works.step2.title': 'Calcula el Impacto',
                'how-it-works.step2.description': 'Calculamos el impacto financiero anualizado basado en tus objetivos y evaluamos el nivel de riesgo de tu estrategia actual.',
                'how-it-works.step3.title': 'Visualiza el Riesgo',
                'how-it-works.step3.description': 'Compara tus objetivos con los estándares de la industria y ve indicadores visuales de tu exposición al riesgo.',
                'how-it-works.step4.title': 'Obtén Recomendaciones',
                'how-it-works.step4.description': 'Recibe recomendaciones accionables para mejorar tu estrategia de recuperación ante desastres y reducir el riesgo empresarial.',
                'stats.calculations': 'Cálculos RTO/RPO',
                'stats.teams-impacted': 'Equipos Impactados',
                'stats.avg-rto': 'RTO Promedio (horas)',
                'stats.accuracy': 'Tasa de Precisión (%)',
                'faq.title': 'Preguntas Frecuentes',
                'faq.q1.question': '¿Cuál es la diferencia entre RTO y RPO?',
                'faq.q1.answer': 'RTO (Objetivo de Tiempo de Recuperación) es el tiempo máximo aceptable para restaurar el servicio después de un desastre. RPO (Objetivo de Punto de Recuperación) es la pérdida máxima aceptable de datos medida en tiempo antes del incidente.',
                'faq.q2.question': '¿Por qué importan RTO y RPO para la continuidad del negocio?',
                'faq.q2.answer': 'RTO y RPO impactan directamente los costos de continuidad del negocio. RTO más largo significa más tiempo de inactividad y pérdida de ingresos. RPO más largo significa más pérdida de datos y costos de recuperación.',
                'faq.q3.question': '¿Cuáles son buenos objetivos RTO y RPO?',
                'faq.q3.answer': 'Los objetivos dependen de la criticidad del negocio. Sistemas críticos: RTO <1 hora, RPO <15 minutos. Sistemas importantes: RTO <4 horas, RPO <1 hora. Sistemas estándar: RTO <24 horas, RPO <4 horas.',
                'faq.q4.question': '¿Cómo reduzco mi RTO y RPO?',
                'faq.q4.answer': 'Mejora la redundancia de infraestructura, implementa conmutación por error automatizada, usa replicación en tiempo real, optimiza estrategias de respaldo e invierte en pruebas y capacitación de recuperación ante desastres.',
                'faq.q5.question': '¿Cuál es el costo de lograr RTO/RPO más bajos?',
                'faq.q5.answer': 'RTO/RPO más bajos requieren más inversión en infraestructura, redundancia y tecnología. El costo aumenta exponencialmente a medida que los objetivos se vuelven más agresivos, pero también lo hace la protección empresarial.',
                'footer.product': 'Producto',
                'footer.features': 'Características',
                'footer.pricing': 'Precios',
                'footer.integrations': 'Integraciones',
                'footer.company': 'Empresa',
                'footer.about': 'Acerca de',
                'footer.blog': 'Blog',
                'footer.careers': 'Carreras',
                'footer.support': 'Soporte',
                'footer.help': 'Centro de Ayuda',
                'footer.contact': 'Contacto',
                'footer.status': 'Estado',
                'footer.legal': 'Legal',
                'footer.privacy': 'Privacidad',
                'footer.terms': 'Términos',
                'footer.cookies': 'Cookies',
                'disclaimer.text': 'Solo estimaciones. No es consejo financiero.'
            }
        };
    }

    initializeEventListeners() {
        // Calculate button
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                console.log('🔘 Calculate Risk button clicked!');
                this.calculateRisk();
            });
            console.log('✅ Calculate Risk button event listener attached');
        } else {
            console.error('❌ Calculate Risk button not found!');
        }
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => this.resetForm());
        
        // Export buttons
        document.getElementById('copy-summary-btn').addEventListener('click', () => this.copySummary());
        document.getElementById('download-csv-btn').addEventListener('click', () => this.downloadCSV());
        const shareBtn = document.getElementById('share-link-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareLink());
        }
        
        // Form inputs
        document.getElementById('rto-target').addEventListener('input', () => this.calculateRisk());
        document.getElementById('rpo-target').addEventListener('input', () => this.calculateRisk());
        document.getElementById('incident-frequency').addEventListener('input', () => this.calculateRisk());
        document.getElementById('revenue-per-hour').addEventListener('input', () => this.calculateRisk());
        document.getElementById('data-recreation-cost').addEventListener('input', () => this.calculateRisk());
        document.getElementById('currency').addEventListener('change', () => this.calculateRisk());
        document.getElementById('data-currency').addEventListener('change', () => this.calculateRisk());
        
        // Language toggle
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
        
        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => this.toggleFAQ(question));
        });
    }

    initializeCounters() {
        // Animate counter numbers
        document.querySelectorAll('.stat-number').forEach(element => {
            const target = parseFloat(element.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                if (target < 10) {
                    element.textContent = current.toFixed(1);
                } else {
                    element.textContent = Math.floor(current).toLocaleString() + '+';
                }
            }, 16);
        });
    }

    calculateRisk() {
        console.log('🔄 Calculate Risk button clicked - starting calculation...');
        
        // Get input values
        const rtoHours = RTOMath.parseLocaleNumber(document.getElementById('rto-target').value);
        const rpoHours = RTOMath.parseLocaleNumber(document.getElementById('rpo-target').value);
        const incidentFrequency = RTOMath.parseLocaleNumber(document.getElementById('incident-frequency').value);
        const revenuePerHour = RTOMath.parseLocaleNumber(document.getElementById('revenue-per-hour').value);
        const dataRecreationCostPerHour = RTOMath.parseLocaleNumber(document.getElementById('data-recreation-cost').value);
        
        console.log('Input values:', { 
            rtoHours, rpoHours, incidentFrequency, revenuePerHour, dataRecreationCostPerHour 
        });
        
        // Validate inputs
        const validation = RTOMath.validateInputs({
            rtoHours,
            rpoHours,
            incidentFrequency,
            revenuePerHour,
            dataRecreationCostPerHour
        });
        
        if (!validation.valid) {
            console.log('❌ Input validation failed:', validation.errors);
            this.showValidationErrors(validation.errors);
            return;
        }
        
        // Calculate RTO impact
        const impact = RTOMath.calculateRTOImpact({
            rtoHours,
            rpoHours,
            incidentFrequency,
            revenuePerHour,
            dataRecreationCostPerHour
        });
        
        console.log('RTO impact calculation result:', impact);
        
        // Assess risk level
        const riskAssessment = RTOMath.assessRiskLevel(rtoHours, rpoHours);
        console.log('Risk assessment result:', riskAssessment);
        
        // Generate recommendations
        const recommendations = RTOMath.generateRecommendations({
            rtoHours,
            rpoHours,
            riskAssessment,
            totalImpact: impact.totalImpact
        });
        console.log('Recommendations:', recommendations);
        
        // Update UI with results
        this.updateResults(impact, riskAssessment, recommendations);
        
        // Update URL hash
        this.updateURLHash();
        
        console.log('✅ Risk calculation complete - UI updated');
    }

    updateResults(impact, riskAssessment, recommendations) {
        const currency = document.getElementById('currency').value;
        
        // Update main results
        document.getElementById('annualized-loss-amount').textContent = FormatUtils.formatCurrency(impact.totalImpact, currency);
        
        // Update cost breakdown
        document.getElementById('rto-loss').textContent = FormatUtils.formatCurrency(impact.rtoLoss, currency);
        document.getElementById('rpo-cost').textContent = FormatUtils.formatCurrency(impact.rpoCost, currency);
        document.getElementById('total-impact').textContent = FormatUtils.formatCurrency(impact.totalImpact, currency);
        
        // Update comparison values
        document.getElementById('rto-comparison').textContent = `${RTOMath.formatDuration(impact.rtoHours)} target`;
        document.getElementById('rpo-comparison').textContent = `${RTOMath.formatDuration(impact.rpoHours)} target`;
        
        // Update risk badge
        const riskBadge = document.getElementById('risk-badge');
        riskBadge.textContent = riskAssessment.level;
        riskBadge.className = `risk-badge risk-${riskAssessment.level.toLowerCase()}`;
        
        // Update risk explanation
        this.updateRiskExplanation(riskAssessment.level);
        
        // Update comparison bars
        this.updateComparisonBars(impact.rtoHours, impact.rpoHours);
        
        // Update recommendations
        this.updateRecommendations(recommendations);
        
        // Clear any previous validation errors
        this.clearValidationErrors();
    }

    updateComparisonBars(rtoHours, rpoHours) {
        const standards = RTOMath.getIndustryStandards();
        
        // Update RTO bar
        const rtoComparison = RTOMath.calculateComparison(rtoHours, standards.critical);
        const rtoTargetLine = document.getElementById('rto-target-line');
        const rtoRiskIndicator = document.getElementById('rto-risk-indicator');
        
        if (rtoTargetLine && rtoRiskIndicator) {
            // Position target line (critical standard = 25% of bar width)
            rtoTargetLine.style.left = '25%';
            
            // Position risk indicator based on RTO value
            const riskPosition = Math.min((rtoHours / standards.important.rto) * 50, 100);
            rtoRiskIndicator.style.left = `${riskPosition}%`;
            rtoRiskIndicator.className = `risk-indicator risk-${rtoComparison.riskLevel.toLowerCase()}`;
        }
        
        // Update RPO bar
        const rpoComparison = RTOMath.calculateComparison(rpoHours, standards.critical);
        const rpoTargetLine = document.getElementById('rpo-target-line');
        const rpoRiskIndicator = document.getElementById('rpo-risk-indicator');
        
        if (rpoTargetLine && rpoRiskIndicator) {
            // Position target line (critical standard = 25% of bar width)
            rpoTargetLine.style.left = '25%';
            
            // Position risk indicator based on RPO value
            const riskPosition = Math.min((rpoHours / standards.important.rpo) * 50, 100);
            rpoRiskIndicator.style.left = `${riskPosition}%`;
            rpoRiskIndicator.className = `risk-indicator risk-${rpoComparison.riskLevel.toLowerCase()}`;
        }
    }

    updateRiskExplanation(riskLevel) {
        const riskExplanation = document.getElementById('risk-explanation');
        const explanationText = riskExplanation.querySelector('.risk-explanation-text');
        
        let explanationKey = 'results.risk-explanation'; // Default
        
        if (riskLevel === 'Low') {
            explanationKey = 'results.risk-low-explanation';
        } else if (riskLevel === 'Medium') {
            explanationKey = 'results.risk-medium-explanation';
        } else if (riskLevel === 'High') {
            explanationKey = 'results.risk-high-explanation';
        }
        
        explanationText.textContent = this.strings[this.currentLanguage][explanationKey];
        explanationText.dataset.i18n = explanationKey;
    }

    updateRecommendations(recommendations) {
        const recommendationsContent = document.getElementById('recommendations-content');
        
        if (recommendations.length === 0) {
            recommendationsContent.innerHTML = '<p data-i18n="results.default-recommendation">Enter your RTO and RPO targets to get personalized recommendations for improving your disaster recovery strategy.</p>';
        } else {
            const recommendationsList = recommendations.map(rec => `<li>${rec}</li>`).join('');
            recommendationsContent.innerHTML = `<ul class="recommendations-list">${recommendationsList}</ul>`;
        }
    }

    showValidationErrors(errors) {
        // Create or update error display
        let errorContainer = document.getElementById('validation-errors');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'validation-errors';
            errorContainer.className = 'validation-errors';
            document.querySelector('.calculator-form .card').appendChild(errorContainer);
        }
        
        errorContainer.innerHTML = errors.map(error => 
            `<div class="error-item">❌ ${error}</div>`
        ).join('');
        errorContainer.style.display = 'block';
    }

    clearValidationErrors() {
        const errorContainer = document.getElementById('validation-errors');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }

    copySummary() {
        const summary = this.generateSummary();
        navigator.clipboard.writeText(summary).then(() => {
            this.showToast('Summary copied to clipboard!');
        }).catch(() => {
            this.showToast('Failed to copy summary');
        });
    }

    downloadCSV() {
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rto-rpo-impact-analysis.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast('CSV downloaded successfully!');
    }

    generateSummary() {
        const annualizedLoss = document.getElementById('annualized-loss-amount').textContent;
        const rtoLoss = document.getElementById('rto-loss').textContent;
        const rpoCost = document.getElementById('rpo-cost').textContent;
        const totalImpact = document.getElementById('total-impact').textContent;
        const riskLevel = document.getElementById('risk-badge').textContent;
        const rtoTarget = document.getElementById('rto-comparison').textContent;
        const rpoTarget = document.getElementById('rpo-comparison').textContent;
        
        return `RTO/RPO Impact Analysis Summary:
        
Annualized Loss: ${annualizedLoss}

Cost Breakdown:
- RTO Loss: ${rtoLoss}
- RPO Cost: ${rpoCost}
- Total Impact: ${totalImpact}

Risk Assessment:
Risk Level: ${riskLevel}
RTO Target: ${rtoTarget}
RPO Target: ${rpoTarget}

Generated by TechImpact.online RTO/RPO Impact Calculator`;
    }

    generateCSV() {
        const headers = ['Metric', 'Value'];
        const rows = [
            ['Annualized Loss', document.getElementById('annualized-loss-amount').textContent],
            ['RTO Loss', document.getElementById('rto-loss').textContent],
            ['RPO Cost', document.getElementById('rpo-cost').textContent],
            ['Total Impact', document.getElementById('total-impact').textContent],
            ['Risk Level', document.getElementById('risk-badge').textContent],
            ['RTO Target', document.getElementById('rto-comparison').textContent],
            ['RPO Target', document.getElementById('rpo-comparison').textContent]
        ];
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        return csvContent;
    }

    shareLink() {
        if (window.ScenarioUrl) {
            ScenarioUrl.copyShareUrl(this.scenarioMap).then((ok) => {
                this.showToast(ok ? 'Share link copied to clipboard!' : 'Failed to copy share link');
            });
            return;
        }
        navigator.clipboard.writeText(window.location.href).then(() => {
            this.showToast('Share link copied to clipboard!');
        }).catch(() => {
            this.showToast('Failed to copy share link');
        });
    }

    updateURLHash() {
        if (window.ScenarioUrl) {
            ScenarioUrl.writeFromForm(this.scenarioMap, { clearHash: true });
            return;
        }
        const params = {
            rto: document.getElementById('rto-target').value,
            rpo: document.getElementById('rpo-target').value,
            frequency: document.getElementById('incident-frequency').value,
            revenue: document.getElementById('revenue-per-hour').value,
            dataCost: document.getElementById('data-recreation-cost').value
        };
        const hash = btoa(JSON.stringify(params));
        if (window.history.replaceState) {
            window.history.replaceState(null, null, `#${hash}`);
        }
    }

    loadScenarioFromUrl() {
        if (window.ScenarioUrl && window.location.search) {
            ScenarioUrl.applyFromLocation(this.scenarioMap);
            return;
        }
        this.loadFromURLHash();
    }

    loadFromURLHash() {
        const hash = window.location.hash.substring(1);
        if (!hash) return;
        try {
            const params = JSON.parse(atob(hash));
            document.getElementById('rto-target').value = params.rto || '';
            document.getElementById('rpo-target').value = params.rpo || '';
            document.getElementById('incident-frequency').value = params.frequency || '';
            document.getElementById('revenue-per-hour').value = params.revenue || '';
            document.getElementById('data-recreation-cost').value = params.dataCost || '';
        } catch (error) {
            console.log('Failed to parse URL hash:', error);
        }
    }

    resetForm() {
        document.getElementById('rto-target').value = '4';
        document.getElementById('rpo-target').value = '1';
        document.getElementById('incident-frequency').value = '2';
        document.getElementById('revenue-per-hour').value = '10000';
        document.getElementById('data-recreation-cost').value = '0';
        
        this.calculateRisk();
        this.showToast('Form reset to default values');
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    toggleFAQ(question) {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.display === 'block';
        
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.style.display = 'none';
        });
        
        // Toggle current FAQ
        answer.style.display = isOpen ? 'none' : 'block';
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        
        // Update all text elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (this.strings[lang] && this.strings[lang][key]) {
                element.textContent = this.strings[lang][key];
            }
        });
    }

    // Manual test function for debugging
    testCalculation() {
        console.log('🧪 Running manual RTO/RPO calculation test...');
        
        // Set test values
        document.getElementById('rto-target').value = '4';
        document.getElementById('rpo-target').value = '1';
        document.getElementById('incident-frequency').value = '2';
        document.getElementById('revenue-per-hour').value = '10000';
        document.getElementById('data-recreation-cost').value = '5000';
        
        console.log('Test values set, running calculation...');
        this.calculateRisk();
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.rtoCalculator = new RTORPOCalculator();
    console.log('🌐 RTO/RPO Calculator available globally as window.rtoCalculator');
    console.log('💡 Try: window.rtoCalculator.testCalculation() to test manually');
    
    // Load parameters from URL hash if present
    window.rtoCalculator.loadFromURLHash();
});
