// SLA Penalty Calculator - TechImpact.online
class SLAPenaltyCalculator {
    constructor() {
        this.currentLanguage = 'en';
        this.strings = this.initializeStrings();
        this.scenarioMap = {
            cv: 'contract-value',
            up: 'promised-uptime',
            dt: 'downtime-input',
            au: 'uptime-input',
            pd: 'period-selector',
            cpd: 'custom-period-days',
            cur: 'currency'
        };
        this.initializeEventListeners();
        this.initializeCounters();
        if (window.ScenarioUrl) {
            ScenarioUrl.applyFromLocation(this.scenarioMap);
            this.toggleCustomPeriod();
        }
        this.calculatePenalty();
        
        console.log('🚀 SLA Penalty Calculator initialized successfully');
    }

    initializeStrings() {
        return {
            en: {
                'nav.product': 'Product',
                'nav.pricing': 'Pricing',
                'nav.resources': 'Resources',
                'nav.blog': 'Blog',
                'header.get-started': 'Get Started',
                'hero.title1': 'Empower Your Tech Decisions with',
                'hero.title2': 'Precision Calculators',
                'hero.subtitle': 'Techimpact.online provides CTOs & developers with essential calculators to assess the financial impact of downtime, SLA penalties, and recovery strategies. Make informed decisions with confidence.',
                'hero.start-trial': 'Try the Calculator',
                'hero.request-demo': 'View Plans',
                'tabs.sla': 'SLA Penalty Calculator',
                'tabs.downtime': 'Website Downtime Cost',
                'tabs.rto-rpo': 'RTO/RPO Impact',
                'form.title': 'SLA Penalty Calculator',
                'form.contract-value': 'Contract Value',
                'form.promised-uptime': 'Promised Uptime (%)',
                'form.actual-downtime': 'Actual Downtime (minutes)',
                'form.achieved-uptime': 'Or Achieved Uptime (%)',
                'form.penalty-scheme': 'Penalty Scheme (Editable)',
                'form.add-tier': '+ Add Tier',
                'form.calculate': 'Calculate Penalty',
                'form.reset': 'Reset',
                'results.title': 'Result',
                'results.total-penalty': 'Total SLA Penalty',
                'results.within-tier': 'Within Tier 2 Penalty',
                'results.actual-uptime': 'Actual Uptime:',
                'results.uptime-below': 'Uptime Below Promised:',
                'results.applied-penalty': 'Applied Penalty:',
                'results.export': 'Export Summary as PNG',
                'how-it-works.title': 'How It Works',
                'how-it-works.step1.title': 'Input Your Variables',
                'how-it-works.step1.description': 'Enter contract details, downtime duration, and other relevant metrics into our intuitive forms.',
                'how-it-works.step2.title': 'Customize the Model',
                'how-it-works.step2.description': 'Adjust penalty tiers, revenue models, or recovery costs to match your specific scenario.',
                'how-it-works.step3.title': 'Calculate the Impact',
                'how-it-works.step3.description': 'Get instant, precise calculations of financial impact based on your inputs.',
                'how-it-works.step4.title': 'Export and Share',
                'how-it-works.step4.description': 'Generate a clean summary report as a PNG to share with stakeholders.',
                'stats.calculations': 'Specialized Calculators',
                'stats.users': 'Supported Currencies',
                'stats.reports': 'Runs in Your Browser',
                'stats.rating': 'Core Tools, No Signup',
                'faq.title': 'Frequently Asked Questions',
                'faq.q1': 'How does the SLA Penalty Calculator work?',
                'faq.a1': 'Our SLA Penalty Calculator works by taking your contract value, promised uptime percentage, and actual downtime duration to calculate the financial penalty based on your SLA agreement. You can customize penalty tiers to match your specific contract terms.',
                'faq.q2': 'What factors influence website downtime costs?',
                'faq.a2': 'Website downtime costs are influenced by factors such as lost revenue (e.g., e-commerce sales), decreased employee productivity, potential SLA penalties, and long-term reputational damage. Our calculator considers these factors to provide a comprehensive cost estimate.',
                'faq.q3': 'Can I customize the penalty tiers and other assumptions?',
                'faq.a3': 'Yes, you can fully customize penalty tiers, contract values, uptime percentages, and other parameters to match your specific SLA agreement and business requirements.',
                'faq.q4': 'Is my data secure?',
                'faq.a4': 'Yes, all calculations are performed locally in your browser. We don\'t store or transmit any of your sensitive contract or business data to our servers.',
                'faq.q5': 'What currencies are supported?',
                'faq.a5': 'Currently, we support USD and EUR currencies. More currencies will be added based on user demand.',
                'footer.tagline': 'Quantifying tech risk, empowering decisions.',
                'footer.product': 'Product',
                'footer.sla-calculator': 'SLA Calculator',
                'footer.downtime-calculator': 'Downtime Calculator',
                'footer.rto-calculator': 'RTO/RPO Calculator',
                'footer.pricing': 'Pricing',
                'footer.resources': 'Resources',
                'footer.blog': 'Blog',
                'footer.documentation': 'Documentation',
                'footer.case-studies': 'Case Studies',
                'footer.support': 'Support',
                'footer.company': 'Company',
                'footer.about': 'About Us',
                'footer.contact': 'Contact',
                'footer.privacy': 'Privacy Policy',
                'footer.terms': 'Terms of Service',
                'footer.copyright': '© 2023 TechImpact.online. All rights reserved.',
                'disclaimer.text': 'Estimates only. Check your contract.'
            },
            es: {
                'nav.product': 'Producto',
                'nav.pricing': 'Precios',
                'nav.resources': 'Recursos',
                'nav.blog': 'Blog',
                'header.get-started': 'Comenzar',
                'hero.title1': 'Potencia tus Decisiones Técnicas con',
                'hero.title2': 'Calculadoras de Precisión',
                'hero.subtitle': 'Techimpact.online proporciona a CTOs y desarrolladores calculadoras esenciales para evaluar el impacto financiero de las interrupciones, penalizaciones SLA y estrategias de recuperación. Toma decisiones informadas con confianza.',
                'hero.start-trial': 'Probar la Calculadora',
                'hero.request-demo': 'Ver Planes',
                'tabs.sla': 'Calculadora de Penalizaciones SLA',
                'tabs.downtime': 'Costo de Interrupción del Sitio',
                'tabs.rto-rpo': 'Impacto RTO/RPO',
                'form.title': 'Calculadora de Penalizaciones SLA',
                'form.contract-value': 'Valor del Contrato',
                'form.promised-uptime': 'Tiempo de Actividad Prometido (%)',
                'form.actual-downtime': 'Tiempo de Inactividad Real (minutos)',
                'form.achieved-uptime': 'O Tiempo de Actividad Logrado (%)',
                'form.penalty-scheme': 'Esquema de Penalizaciones (Editable)',
                'form.add-tier': '+ Agregar Nivel',
                'form.calculate': 'Calcular Penalización',
                'form.reset': 'Reiniciar',
                'results.title': 'Resultado',
                'results.total-penalty': 'Penalización SLA Total',
                'results.within-tier': 'Dentro de Penalización Nivel 2',
                'results.actual-uptime': 'Tiempo de Actividad Real:',
                'results.uptime-below': 'Tiempo de Actividad por Debajo:',
                'results.applied-penalty': 'Penalización Aplicada:',
                'results.export': 'Exportar Resumen como PNG',
                'how-it-works.title': 'Cómo Funciona',
                'how-it-works.step1.title': 'Ingresa tus Variables',
                'how-it-works.step1.description': 'Ingresa detalles del contrato, duración de la interrupción y otras métricas relevantes en nuestros formularios intuitivos.',
                'how-it-works.step2.title': 'Personaliza el Modelo',
                'how-it-works.step2.description': 'Ajusta niveles de penalización, modelos de ingresos o costos de recuperación para que coincidan con tu escenario específico.',
                'how-it-works.step3.title': 'Calcula el Impacto',
                'how-it-works.step3.description': 'Obtén cálculos instantáneos y precisos del impacto financiero basados en tus entradas.',
                'how-it-works.step4.title': 'Exporta y Comparte',
                'how-it-works.step4.description': 'Genera un reporte de resumen limpio como PNG para compartir con las partes interesadas.',
                'stats.calculations': 'Calculadoras Especializadas',
                'stats.users': 'Monedas Compatibles',
                'stats.reports': 'Se Ejecuta en tu Navegador',
                'stats.rating': 'Herramientas Gratis, Sin Registro',
                'faq.title': 'Preguntas Frecuentes',
                'faq.q1': '¿Cómo funciona la Calculadora de Penalizaciones SLA?',
                'faq.a1': 'Nuestra Calculadora de Penalizaciones SLA funciona tomando el valor de tu contrato, porcentaje de tiempo de actividad prometido y duración real de la interrupción para calcular la penalización financiera basada en tu acuerdo SLA. Puedes personalizar los niveles de penalización para que coincidan con los términos específicos de tu contrato.',
                'faq.q2': '¿Qué factores influyen en los costos de interrupción del sitio web?',
                'faq.a2': 'Los costos de interrupción del sitio web están influenciados por factores como ingresos perdidos (ej. ventas de comercio electrónico), disminución de la productividad de los empleados, posibles penalizaciones SLA y daño reputacional a largo plazo. Nuestra calculadora considera estos factores para proporcionar una estimación de costo integral.',
                'faq.q3': '¿Puedo personalizar los niveles de penalización y otras suposiciones?',
                'faq.a3': 'Sí, puedes personalizar completamente los niveles de penalización, valores de contrato, porcentajes de tiempo de actividad y otros parámetros para que coincidan con tu acuerdo SLA específico y requisitos comerciales.',
                'faq.q4': '¿Mis datos están seguros?',
                'faq.a4': 'Sí, todos los cálculos se realizan localmente en tu navegador. No almacenamos ni transmitimos ninguno de tus datos sensibles de contrato o comerciales a nuestros servidores.',
                'faq.q5': '¿Qué monedas están soportadas?',
                'faq.a5': 'Actualmente, soportamos las monedas USD y EUR. Se agregarán más monedas según la demanda de los usuarios.',
                'footer.tagline': 'Cuantificando el riesgo tecnológico, empoderando decisiones.',
                'footer.product': 'Producto',
                'footer.sla-calculator': 'Calculadora SLA',
                'footer.downtime-calculator': 'Calculadora de Interrupciones',
                'footer.rto-calculator': 'Calculadora RTO/RPO',
                'footer.pricing': 'Precios',
                'footer.resources': 'Recursos',
                'footer.blog': 'Blog',
                'footer.documentation': 'Documentación',
                'footer.case-studies': 'Casos de Estudio',
                'footer.support': 'Soporte',
                'footer.company': 'Empresa',
                'footer.about': 'Acerca de Nosotros',
                'footer.contact': 'Contacto',
                'footer.privacy': 'Política de Privacidad',
                'footer.terms': 'Términos de Servicio',
                'footer.copyright': '© 2023 TechImpact.online. Todos los derechos reservados.',
                'disclaimer.text': 'Solo estimaciones. Revisa tu contrato.'
            }
        };
    }

    initializeEventListeners() {
        // Calculate button
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                console.log('🔘 Calculate button clicked!');
                this.calculatePenalty();
            });
            console.log('✅ Calculate button event listener attached');
        } else {
            console.error('❌ Calculate button not found!');
        }
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => this.resetForm());
        
        // Export button
        document.getElementById('export-btn').addEventListener('click', () => this.exportSummary());

        const shareBtn = document.getElementById('share-scenario-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                if (!window.ScenarioUrl) return;
                const ok = await ScenarioUrl.copyShareUrl(this.scenarioMap);
                shareBtn.textContent = ok ? 'Link copied!' : 'Copy failed — copy from address bar';
                setTimeout(() => { shareBtn.textContent = 'Copy shareable scenario link'; }, 2000);
            });
        }
        
        // Form inputs
        document.getElementById('contract-value').addEventListener('input', () => this.calculatePenalty());
        document.getElementById('promised-uptime').addEventListener('input', () => this.calculatePenalty());
        document.getElementById('downtime-input').addEventListener('input', () => this.calculatePenalty());
        document.getElementById('uptime-input').addEventListener('input', () => this.calculatePenalty());
        document.getElementById('currency').addEventListener('change', () => this.calculatePenalty());
        
        // Period selector
        document.getElementById('period-selector').addEventListener('change', () => {
            this.toggleCustomPeriod();
            this.calculatePenalty();
        });
        
        // Custom period input
        document.getElementById('custom-period-days').addEventListener('input', () => this.calculatePenalty());
        
        // Penalty tiers
        document.querySelector('.add-tier-btn').addEventListener('click', () => this.addPenaltyTier());
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-tier')) {
                this.removePenaltyTier(e.target);
            }
        });
        
        // Tier validation on input changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('tier-threshold') || e.target.classList.contains('tier-penalty')) {
                this.validateTiers();
            }
        });
        
        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => this.toggleFAQ(question));
        });
        
        // Language toggle
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
        
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }

    initializeCounters() {
        // Animate counters on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('[data-counter]').forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }, 16);
    }

    calculatePenalty() {
        console.log('🔄 Calculate Penalty button clicked - starting calculation...');
        
        const contractValue = SLAMath.parseLocaleNumber(document.getElementById('contract-value').value);
        const promisedUptime = SLAMath.parseLocaleNumber(document.getElementById('promised-uptime').value);
        const currency = document.getElementById('currency').value;
        
        console.log('Input values:', { contractValue, promisedUptime, currency });
        
        // Get period in days
        const periodDays = this.getPeriodDays();
        
        // Handle downtime vs uptime inputs
        const downtimeInput = SLAMath.parseLocaleNumber(document.getElementById('downtime-input').value);
        const uptimeInput = SLAMath.parseLocaleNumber(document.getElementById('uptime-input').value);
        
        console.log('Downtime/Uptime inputs:', { downtimeInput, uptimeInput, periodDays });
        
        let actualUptime;
        
        // If downtime is provided (including 0), calculate uptime from downtime
        if (downtimeInput >= 0) {
            actualUptime = SLAMath.calculateActualUptimeFromDowntime(downtimeInput, periodDays);
            // Update the uptime input field to reflect calculated value
            document.getElementById('uptime-input').value = actualUptime.toFixed(2);
            console.log('Calculated actual uptime from downtime:', actualUptime);
        } else if (uptimeInput > 0) {
            actualUptime = uptimeInput;
            console.log('Using direct uptime input:', actualUptime);
        } else {
            actualUptime = 0;
            console.log('No valid input, defaulting to 0% uptime');
        }
        
        // Update allowed downtime information
        this.updateAllowedDowntimeInfo(promisedUptime, periodDays, downtimeInput);
        
        // Get penalty tiers and validate them
        const penaltyTiers = this.getPenaltyTiers();
        console.log('Retrieved penalty tiers:', penaltyTiers);
        
        const tiersValid = this.validateTiers();
        console.log('Tiers validation result:', tiersValid);
        
        // Only calculate if tiers are valid
        if (!tiersValid) {
            // Show error state in results
            console.log('❌ Tiers are invalid, showing error state');
            this.showTierValidationError();
            return;
        }

        // Calculate penalty using SLA math
        console.log('Calculating penalty with:', { contractValue, promisedUptime, actualUptime, penaltyTiers });
        
        const result = SLAMath.calculatePenalty({
            contractValue,
            promisedUptime,
            actualUptime,
            penaltyTiers
        });
        
        console.log('SLA calculation result:', result);
        
        // Update UI with results
        this.updateResults(result, currency);
        if (window.ScenarioUrl) {
            ScenarioUrl.writeFromForm(this.scenarioMap, { clearHash: true });
        }
        
        console.log('✅ Calculation complete - UI updated');
    }

    // Manual test function for debugging
    testCalculation() {
        console.log('🧪 Running manual calculation test...');
        
        // Set test values
        document.getElementById('contract-value').value = '1000000';
        document.getElementById('promised-uptime').value = '99.95';
        document.getElementById('downtime-input').value = '120';
        
        console.log('Test values set, running calculation...');
        this.calculatePenalty();
    }

    getPeriodDays() {
        const periodSelector = document.getElementById('period-selector');
        const customPeriodGroup = document.getElementById('custom-period-group');
        
        if (periodSelector.value === 'custom') {
            return SLAMath.parseLocaleNumber(document.getElementById('custom-period-days').value) || 30;
        } else {
            return parseInt(periodSelector.value) || 30;
        }
    }

    updateAllowedDowntimeInfo(promisedUptime, periodDays, actualDowntime) {
        const allowedDowntime = SLAMath.calculateAllowedDowntime(promisedUptime, periodDays);
        const allowedDowntimeValue = document.getElementById('allowed-downtime-value');
        const downtimeStatus = document.getElementById('downtime-status');
        
        // Update allowed downtime value
        allowedDowntimeValue.textContent = FormatUtils.formatMinutes(allowedDowntime) + ' minutes';
        
        // Update status message
        const statusText = FormatUtils.formatDowntimeStatus(actualDowntime, allowedDowntime);
        downtimeStatus.textContent = statusText;
        
        // Update status class
        downtimeStatus.className = 'downtime-status';
        if (actualDowntime <= allowedDowntime) {
            downtimeStatus.classList.add('within');
        } else {
            downtimeStatus.classList.add('exceeded');
        }
    }

    getPenaltyPercentage(uptimeBelow) {
        const tiers = this.getPenaltyTiers();
        
        for (let i = tiers.length - 1; i >= 0; i--) {
            const tier = tiers[i];
            if (this.matchesTier(uptimeBelow, tier.threshold)) {
                return tier.penalty;
            }
        }
        
        return 0;
    }

    getPenaltyTier(uptimeBelow) {
        const tiers = this.getPenaltyTiers();
        
        for (let i = tiers.length - 1; i >= 0; i--) {
            const tier = tiers[i];
            if (this.matchesTier(uptimeBelow, tier.threshold)) {
                return `Tier ${i + 1}`;
            }
        }
        
        return 'No penalty';
    }

    getTierStatus(uptimeBelow) {
        const tiers = this.getPenaltyTiers();
        
        for (let i = tiers.length - 1; i >= 0; i--) {
            const tier = tiers[i];
            if (this.matchesTier(uptimeBelow, tier.threshold)) {
                return i === 0 ? 'success' : i === 1 ? 'warning' : 'error';
            }
        }
        
        return 'success';
    }

    matchesTier(uptimeBelow, threshold) {
        if (threshold.includes('<')) {
            const value = parseFloat(threshold.replace('<', '').replace('%', ''));
            return uptimeBelow < value;
        } else if (threshold.includes('>')) {
            const value = parseFloat(threshold.replace('>', '').replace('%', ''));
            return uptimeBelow > value;
        } else if (threshold.includes('-')) {
            const [min, max] = threshold.split('-').map(v => parseFloat(v.replace('%', '')));
            return uptimeBelow >= min && uptimeBelow <= max;
        }
        return false;
    }

    getPenaltyTiers() {
        const tiers = [];
        document.querySelectorAll('.penalty-tier').forEach((tier, index) => {
            const threshold = tier.querySelector('.tier-threshold').value;
            const penalty = SLAMath.parseLocaleNumber(tier.querySelector('.tier-penalty').value);
            
            console.log(`Processing Tier ${index + 1}:`, { threshold, penalty });
            
            if (threshold && penalty > 0) {
                try {
                    const parsedThreshold = SLAMath.parseTierThreshold(threshold);
                    tiers.push({ 
                        threshold: parsedThreshold,
                        name: `Tier ${index + 1}`,
                        percentage: penalty
                    });
                    console.log(`Added tier with parsed threshold:`, parsedThreshold);
                } catch (error) {
                    console.error(`Error parsing threshold "${threshold}":`, error);
                }
            }
        });
        
        const sortedTiers = tiers.sort((a, b) => a.threshold - b.threshold);
        console.log('Final penalty tiers:', sortedTiers);
        return sortedTiers;
    }

    updateResults(result, currency) {
        const { totalPenalty, tier, shortfall, appliedPercentage, actualUptime, promisedUptime } = result;
        
        // Update penalty amount
        document.getElementById('penalty-amount').textContent = FormatUtils.formatCurrency(totalPenalty, currency);
        
        // Update details
        document.getElementById('actual-uptime').textContent = FormatUtils.formatPercentage(actualUptime);
        document.getElementById('uptime-below').textContent = FormatUtils.formatPercentage(shortfall);
        document.getElementById('applied-penalty').textContent = FormatUtils.formatPercentage(appliedPercentage);
        
        // Update badge
        const badge = document.getElementById('penalty-badge');
        badge.textContent = tier;
        badge.className = `penalty-badge ${FormatUtils.getTierBadgeClass(tier)}`;
        
        // Update explanation list
        this.updateExplanationList(result);
        
        // Update traffic light visualization
        this.updateTrafficLight(result);
    }

    updateExplanationList(result) {
        const explanationList = document.getElementById('explanation-list');
        const items = FormatUtils.createExplanationList(result, SLAMath.parseLocaleNumber(document.getElementById('contract-value').value));
        
        explanationList.innerHTML = items.map(item => `<li>${item}</li>`).join('');
    }

    updateTrafficLight(result) {
        const { tier, shortfall } = result;
        const marker = document.getElementById('tier-marker');
        const markerValue = document.getElementById('marker-value');
        const segments = document.querySelectorAll('.tier-segment');
        
        // Reset all segments
        segments.forEach(segment => segment.classList.remove('active'));
        
        // Activate current tier segment
        const activeSegment = document.querySelector(`[data-tier="${tier}"]`);
        if (activeSegment) {
            activeSegment.classList.add('active');
        }
        
        // Update marker value
        markerValue.textContent = FormatUtils.formatPercentage(shortfall);
        
        // Position marker based on shortfall
        if (tier === "No penalty" || shortfall <= 0) {
            marker.style.left = '5%';
        } else {
            // Map shortfall to position on the bar (0% to 2% range)
            const maxShortfall = 2;
            const position = Math.min((shortfall / maxShortfall) * 100, 95);
            marker.style.left = `${position}%`;
        }
    }

    toggleCustomPeriod() {
        const periodSelector = document.getElementById('period-selector');
        const customPeriodGroup = document.getElementById('custom-period-group');
        
        if (periodSelector.value === 'custom') {
            customPeriodGroup.style.display = 'block';
        } else {
            customPeriodGroup.style.display = 'none';
        }
    }

    validateTiers() {
        const tiers = this.getPenaltyTiers();
        const validation = SLAMath.validateTiers(tiers);
        const validationContainer = document.getElementById('tier-validation');
        const errorsContainer = document.getElementById('tier-errors');
        const warningsContainer = document.getElementById('tier-warnings');
        
        if (!validation.valid || validation.warnings.length > 0) {
            validationContainer.style.display = 'block';
            
            // Display errors
            if (validation.errors.length > 0) {
                errorsContainer.innerHTML = validation.errors.map(error => 
                    `<div>❌ ${error}</div>`
                ).join('');
            } else {
                errorsContainer.innerHTML = '';
            }
            
            // Display warnings
            if (validation.warnings.length > 0) {
                warningsContainer.innerHTML = validation.warnings.map(warning => 
                    `<div>⚠️ ${warning}</div>`
                ).join('');
            } else {
                warningsContainer.innerHTML = '';
            }
        } else {
            validationContainer.style.display = 'none';
        }
        
        return validation.valid;
    }

    showTierValidationError() {
        // Show error state in results when tiers are invalid
        document.getElementById('penalty-amount').textContent = 'Invalid Tiers';
        document.getElementById('penalty-badge').textContent = 'Fix Tier Configuration';
        document.getElementById('penalty-badge').className = 'penalty-badge badge-secondary';
        
        // Clear other results
        document.getElementById('actual-uptime').textContent = '--';
        document.getElementById('uptime-below').textContent = '--';
        document.getElementById('applied-penalty').textContent = '--';
        
        // Clear explanation list
        document.getElementById('explanation-list').innerHTML = '<li>Please fix tier configuration errors above</li>';
        
        // Reset traffic light
        const marker = document.getElementById('tier-marker');
        const segments = document.querySelectorAll('.tier-segment');
        segments.forEach(segment => segment.classList.remove('active'));
        marker.style.left = '5%';
        document.getElementById('marker-value').textContent = '--';
    }

    updateUptimeFromDowntime() {
        const downtime = parseFloat(document.getElementById('downtime-input').value) || 0;
        const promisedUptime = parseFloat(document.getElementById('promised-uptime').value) || 0;
        
        if (downtime > 0 && promisedUptime > 0) {
            // Calculate minutes in a month (30 days * 24 hours * 60 minutes)
            const minutesInMonth = 30 * 24 * 60;
            const actualUptime = Math.max(0, promisedUptime - (downtime / minutesInMonth) * 100);
            document.getElementById('uptime-input').value = actualUptime.toFixed(2);
        }
        
        this.calculatePenalty();
    }

    updateDowntimeFromUptime() {
        const actualUptime = parseFloat(document.getElementById('uptime-input').value) || 0;
        const promisedUptime = parseFloat(document.getElementById('promised-uptime').value) || 0;
        
        if (actualUptime > 0 && promisedUptime > 0) {
            const uptimeBelow = Math.max(0, promisedUptime - actualUptime);
            const minutesInMonth = 30 * 24 * 60;
            const downtime = (uptimeBelow / 100) * minutesInMonth;
            document.getElementById('downtime-input').value = Math.round(downtime);
        }
        
        this.calculatePenalty();
    }

    addPenaltyTier() {
        const container = document.getElementById('penalty-tiers');
        const tier = document.createElement('div');
        tier.className = 'penalty-tier';
        tier.innerHTML = `
            <input type="text" class="tier-threshold" placeholder="Threshold" value="">
            <input type="number" class="tier-penalty" value="0" min="0" max="100" step="0.1" placeholder="Penalty %">
            <button class="remove-tier" type="button">×</button>
        `;
        container.appendChild(tier);
        
        // Add event listeners to new inputs
        tier.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.calculatePenalty());
        });
    }

    removePenaltyTier(button) {
        if (document.querySelectorAll('.penalty-tier').length > 1) {
            button.parentElement.remove();
            this.calculatePenalty();
        }
    }

    resetForm() {
        document.getElementById('contract-value').value = 1000000;
        document.getElementById('promised-uptime').value = 99.95;
        document.getElementById('downtime-input').value = 120;
        document.getElementById('uptime-input').value = 99.72;
        document.getElementById('currency').value = 'USD';
        
        // Reset penalty tiers to default
        const container = document.getElementById('penalty-tiers');
        container.innerHTML = `
            <div class="penalty-tier">
                <input type="text" class="tier-threshold" value="< 0.1%" placeholder="Threshold">
                <input type="number" class="tier-penalty" value="5" min="0" max="100" step="0.1" placeholder="Penalty %">
                <button class="remove-tier" type="button">×</button>
            </div>
            <div class="penalty-tier">
                <input type="text" class="tier-threshold" value="0.1% - 0.5%" placeholder="Threshold">
                <input type="number" class="tier-penalty" value="10" min="0" max="100" step="0.1" placeholder="Penalty %">
                <button class="remove-tier" type="button">×</button>
            </div>
            <div class="penalty-tier">
                <input type="text" class="tier-threshold" value="> 0.5%" placeholder="Threshold">
                <input type="number" class="tier-penalty" value="25" min="0" max="100" step="0.1" placeholder="Penalty %">
                <button class="remove-tier" type="button">×</button>
            </div>
        `;
        
        // Re-add event listeners
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => this.calculatePenalty());
        });
        container.querySelectorAll('.remove-tier').forEach(button => {
            button.addEventListener('click', (e) => this.removePenaltyTier(e.target));
        });
        
        this.calculatePenalty();
    }

    exportSummary() {
        // Create a canvas for the summary
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // Set background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SLA Penalty Summary', canvas.width / 2, 60);
        
        // Add results
        const penaltyAmount = document.getElementById('penalty-amount').textContent;
        const actualUptime = document.getElementById('actual-uptime').textContent;
        const uptimeBelow = document.getElementById('uptime-below').textContent;
        const appliedPenalty = document.getElementById('applied-penalty').textContent;
        
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText(penaltyAmount, canvas.width / 2, 150);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Total SLA Penalty', canvas.width / 2, 190);
        
        // Add details
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Actual Uptime: ${actualUptime}`, 100, 280);
        ctx.fillText(`Uptime Below Promised: ${uptimeBelow}`, 100, 320);
        ctx.fillText(`Applied Penalty: ${appliedPenalty}`, 100, 360);
        
        // Add footer
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#888888';
        ctx.fillText('Generated by TechImpact.online', canvas.width / 2, 550);
        ctx.fillText('Estimates only. Check your contract.', canvas.width / 2, 580);
        
        // Download the image
        const link = document.createElement('a');
        link.download = 'sla-penalty-summary.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    toggleFAQ(question) {
        const answer = question.nextElementSibling;
        const isActive = answer.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
            answer.classList.add('active');
        }
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        
        // Update all text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (this.strings[lang] && this.strings[lang][key]) {
                element.textContent = this.strings[lang][key];
            }
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // For now, just show a placeholder message
        if (tabName !== 'sla') {
            alert(`The ${tabName} calculator is coming soon!`);
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.slaCalculator = new SLAPenaltyCalculator();
    console.log('🌐 SLA Calculator available globally as window.slaCalculator');
    console.log('💡 Try: window.slaCalculator.testCalculation() to test manually');
});
