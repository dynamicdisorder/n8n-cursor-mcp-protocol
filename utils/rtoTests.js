// Comprehensive Unit Tests for RTO/RPO Impact Calculator
class RTOCalculatorTests {
    constructor() {
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
        this.isDevMode = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
    }

    /**
     * Run all tests
     */
    runAllTests() {
        console.log('🧪 Running RTO/RPO Impact Calculator Tests...\n');
        
        this.testAnnualizedLossCalculation();
        this.testRPOCostCalculation();
        this.testRiskBadgeThresholds();
        this.testRecommendationsLogic();
        this.testIndustryStandards();
        this.testInputValidation();
        this.testLocaleParsing();
        this.testComparisonCalculations();
        this.testEdgeCases();
        
        this.printResults();
        return this.failed === 0;
    }

    /**
     * Test annualized loss calculation: incident frequency × revenue/hour × RTO
     */
    testAnnualizedLossCalculation() {
        console.log('💰 Testing Annualized Loss Calculation...');
        
        // Test 1: Basic annualized loss calculation
        const loss1 = RTOMath.calculateAnnualizedLoss(4, 2, 10000);
        this.assert(Math.abs(loss1 - 80000) < 0.01, 
            'Annualized Loss: 4h RTO × 2 incidents × $10,000/hour = $80,000', 
            { input: { rto: 4, frequency: 2, revenue: 10000 }, output: loss1 });
        
        // Test 2: High frequency incidents
        const loss2 = RTOMath.calculateAnnualizedLoss(2, 12, 5000);
        this.assert(Math.abs(loss2 - 120000) < 0.01, 
            'Annualized Loss: 2h RTO × 12 incidents × $5,000/hour = $120,000', 
            { input: { rto: 2, frequency: 12, revenue: 5000 }, output: loss2 });
        
        // Test 3: Low frequency, high RTO
        const loss3 = RTOMath.calculateAnnualizedLoss(24, 1, 15000);
        this.assert(Math.abs(loss3 - 360000) < 0.01, 
            'Annualized Loss: 24h RTO × 1 incident × $15,000/hour = $360,000', 
            { input: { rto: 24, frequency: 1, revenue: 15000 }, output: loss3 });
        
        // Test 4: Decimal values
        const loss4 = RTOMath.calculateAnnualizedLoss(1.5, 3.5, 8500);
        this.assert(Math.abs(loss4 - 44625) < 0.01, 
            'Annualized Loss: 1.5h RTO × 3.5 incidents × $8,500/hour = $44,625', 
            { input: { rto: 1.5, frequency: 3.5, revenue: 8500 }, output: loss4 });
    }

    /**
     * Test RPO cost calculation when data recreation cost is entered
     */
    testRPOCostCalculation() {
        console.log('💾 Testing RPO Cost Calculation...');
        
        // Test 1: Basic RPO cost calculation
        const rpoCost1 = RTOMath.calculateRPOCost(2, 3, 5000);
        this.assert(Math.abs(rpoCost1 - 30000) < 0.01, 
            'RPO Cost: 2h RPO × 3 incidents × $5,000/hour = $30,000', 
            { input: { rpo: 2, frequency: 3, cost: 5000 }, output: rpoCost1 });
        
        // Test 2: Zero data recreation cost
        const rpoCost2 = RTOMath.calculateRPOCost(4, 2, 0);
        this.assert(rpoCost2 === 0, 
            'RPO Cost: No data recreation cost = $0', 
            { input: { rpo: 4, frequency: 2, cost: 0 }, output: rpoCost2 });
        
        // Test 3: High data recreation cost
        const rpoCost3 = RTOMath.calculateRPOCost(0.5, 6, 15000);
        this.assert(Math.abs(rpoCost3 - 45000) < 0.01, 
            'RPO Cost: 0.5h RPO × 6 incidents × $15,000/hour = $45,000', 
            { input: { rpo: 0.5, frequency: 6, cost: 15000 }, output: rpoCost3 });
        
        // Test 4: Negative data recreation cost (should return 0)
        const rpoCost4 = RTOMath.calculateRPOCost(2, 3, -1000);
        this.assert(rpoCost4 === 0, 
            'RPO Cost: Negative data recreation cost should return $0', 
            { input: { rpo: 2, frequency: 3, cost: -1000 }, output: rpoCost4 });
    }

    /**
     * Test risk badge thresholds (e.g., >4h RTO = High)
     */
    testRiskBadgeThresholds() {
        console.log('⚠️ Testing Risk Badge Thresholds...');
        
        // Test 1: Low risk (RTO <= 1h, RPO <= 0.25h)
        const risk1 = RTOMath.assessRiskLevel(1, 0.25);
        this.assert(risk1.level === 'Low', 
            'Risk Level: 1h RTO, 0.25h RPO = Low risk', 
            { input: { rto: 1, rpo: 0.25 }, output: risk1.level });
        
        // Test 2: Medium risk (RTO <= 4h, RPO <= 1h)
        const risk2 = RTOMath.assessRiskLevel(4, 1);
        this.assert(risk2.level === 'Medium', 
            'Risk Level: 4h RTO, 1h RPO = Medium risk', 
            { input: { rto: 4, rpo: 1 }, output: risk2.level });
        
        // Test 3: High risk (RTO > 4h)
        const risk3 = RTOMath.assessRiskLevel(8, 2);
        this.assert(risk3.level === 'High', 
            'Risk Level: 8h RTO, 2h RPO = High risk', 
            { input: { rto: 8, rpo: 2 }, output: risk3.level });
        
        // Test 4: High risk (RPO > 4h)
        const risk4 = RTOMath.assessRiskLevel(2, 8);
        this.assert(risk4.level === 'High', 
            'Risk Level: 2h RTO, 8h RPO = High risk', 
            { input: { rto: 2, rpo: 8 }, output: risk4.level });
        
        // Test 5: Edge case - exactly 4h RTO
        const risk5 = RTOMath.assessRiskLevel(4, 0.5);
        this.assert(risk5.level === 'Medium', 
            'Risk Level: Exactly 4h RTO = Medium risk', 
            { input: { rto: 4, rpo: 0.5 }, output: risk5.level });
    }

    /**
     * Test recommendations logic mapping to inputs
     */
    testRecommendationsLogic() {
        console.log('💡 Testing Recommendations Logic...');
        
        // Test 1: High RTO should suggest automated failover
        const params1 = {
            rtoHours: 8,
            rpoHours: 1,
            riskAssessment: { level: 'High' },
            totalImpact: 150000
        };
        const recs1 = RTOMath.generateRecommendations(params1);
        const hasAutomatedFailover = recs1.some(rec => rec.includes('automated failover'));
        this.assert(hasAutomatedFailover, 
            'High RTO should recommend automated failover systems', 
            { input: params1, output: recs1 });
        
        // Test 2: High RPO should suggest real-time replication
        const params2 = {
            rtoHours: 2,
            rpoHours: 8,
            riskAssessment: { level: 'High' },
            totalImpact: 100000
        };
        const recs2 = RTOMath.generateRecommendations(params2);
        const hasReplication = recs2.some(rec => rec.includes('real-time data replication'));
        this.assert(hasReplication, 
            'High RPO should recommend real-time data replication', 
            { input: params2, output: recs2 });
        
        // Test 3: Low risk should suggest maintenance recommendations
        const params3 = {
            rtoHours: 0.5,
            rpoHours: 0.1,
            riskAssessment: { level: 'Low' },
            totalImpact: 50000
        };
        const recs3 = RTOMath.generateRecommendations(params3);
        const hasMaintenance = recs3.some(rec => rec.includes('maintain') || rec.includes('excellent'));
        this.assert(hasMaintenance, 
            'Low risk should suggest maintenance recommendations', 
            { input: params3, output: recs3 });
        
        // Test 4: High financial impact should suggest cost-justified improvements
        const params4 = {
            rtoHours: 6,
            rpoHours: 4,
            riskAssessment: { level: 'High' },
            totalImpact: 500000
        };
        const recs4 = RTOMath.generateRecommendations(params4);
        const hasCostJustified = recs4.some(rec => rec.includes('cost-justified'));
        this.assert(hasCostJustified, 
            'High financial impact should suggest cost-justified improvements', 
            { input: params4, output: recs4 });
    }

    /**
     * Test industry standards values
     */
    testIndustryStandards() {
        console.log('📊 Testing Industry Standards...');
        
        const standards = RTOMath.getIndustryStandards();
        
        // Test critical standards
        this.assert(standards.critical.rto === 1, 
            'Critical RTO standard should be 1 hour', 
            { input: 'critical.rto', output: standards.critical.rto });
        
        this.assert(standards.critical.rpo === 0.25, 
            'Critical RPO standard should be 0.25 hours (15 minutes)', 
            { input: 'critical.rpo', output: standards.critical.rpo });
        
        // Test important standards
        this.assert(standards.important.rto === 4, 
            'Important RTO standard should be 4 hours', 
            { input: 'important.rto', output: standards.important.rto });
        
        this.assert(standards.important.rpo === 1, 
            'Important RPO standard should be 1 hour', 
            { input: 'important.rpo', output: standards.important.rpo });
        
        // Test standard standards
        this.assert(standards.standard.rto === 24, 
            'Standard RTO standard should be 24 hours', 
            { input: 'standard.rto', output: standards.standard.rto });
        
        this.assert(standards.standard.rpo === 4, 
            'Standard RPO standard should be 4 hours', 
            { input: 'standard.rpo', output: standards.standard.rpo });
    }

    /**
     * Test input validation
     */
    testInputValidation() {
        console.log('✅ Testing Input Validation...');
        
        // Test 1: Valid inputs
        const validInputs = {
            rtoHours: 4,
            rpoHours: 1,
            incidentFrequency: 2,
            revenuePerHour: 10000,
            dataRecreationCostPerHour: 5000
        };
        const validation1 = RTOMath.validateInputs(validInputs);
        this.assert(validation1.valid, 
            'Valid inputs should pass validation', 
            validation1);
        
        // Test 2: Invalid RTO
        const invalidInputs1 = { ...validInputs, rtoHours: 0 };
        const validation2 = RTOMath.validateInputs(invalidInputs1);
        this.assert(!validation2.valid, 
            'Zero RTO should fail validation', 
            validation2);
        
        // Test 3: Invalid RPO
        const invalidInputs2 = { ...validInputs, rpoHours: -1 };
        const validation3 = RTOMath.validateInputs(invalidInputs2);
        this.assert(!validation3.valid, 
            'Negative RPO should fail validation', 
            validation3);
        
        // Test 4: Warning for high values
        const warningInputs = { ...validInputs, rtoHours: 200 };
        const validation4 = RTOMath.validateInputs(warningInputs);
        this.assert(validation4.valid && validation4.warnings.length > 0, 
            'High RTO should generate warning', 
            validation4);
    }

    /**
     * Test locale number parsing
     */
    testLocaleParsing() {
        console.log('🌍 Testing Locale Parsing...');
        
        // Test 1: Standard decimal
        const parsed1 = RTOMath.parseLocaleNumber('10000.50');
        this.assert(parsed1 === 10000.50, 
            'Parse "10000.50" → 10000.50', 
            { input: '10000.50', output: parsed1 });
        
        // Test 2: Comma decimal separator
        const parsed2 = RTOMath.parseLocaleNumber('10000,50');
        this.assert(parsed2 === 10000.50, 
            'Parse "10000,50" → 10000.50', 
            { input: '10000,50', output: parsed2 });
        
        // Test 3: Currency symbols
        const parsed3 = RTOMath.parseLocaleNumber('$10,000.50');
        this.assert(parsed3 === 10000.50, 
            'Parse "$10,000.50" → 10000.50', 
            { input: '$10,000.50', output: parsed3 });
        
        // Test 4: Empty string
        const parsed4 = RTOMath.parseLocaleNumber('');
        this.assert(parsed4 === 0, 
            'Parse empty string → 0', 
            { input: '', output: parsed4 });
    }

    /**
     * Test comparison calculations for visualization
     */
    testComparisonCalculations() {
        console.log('📈 Testing Comparison Calculations...');
        
        const standards = RTOMath.getIndustryStandards();
        
        // Test 1: Target below critical standard
        const comp1 = RTOMath.calculateComparison(0.5, standards.critical);
        this.assert(comp1.riskLevel === 'Low', 
            'Target below critical standard should be Low risk', 
            { input: { target: 0.5, standard: 'critical' }, output: comp1.riskLevel });
        
        // Test 2: Target above important standard
        const comp2 = RTOMath.calculateComparison(8, standards.important);
        this.assert(comp2.riskLevel === 'High', 
            'Target above important standard should be High risk', 
            { input: { target: 8, standard: 'important' }, output: comp2.riskLevel });
        
        // Test 3: Percentage calculation
        const comp3 = RTOMath.calculateComparison(2, standards.critical);
        this.assert(Math.abs(comp3.critical - 200) < 0.01, 
            'Target 2x critical standard should be 200%', 
            { input: { target: 2, standard: 'critical' }, output: comp3.critical });
    }

    /**
     * Test edge cases and error conditions
     */
    testEdgeCases() {
        console.log('🔍 Testing Edge Cases...');
        
        // Test 1: Very small values
        const impact1 = RTOMath.calculateRTOImpact({
            rtoHours: 0.1,
            rpoHours: 0.01,
            incidentFrequency: 0.5,
            revenuePerHour: 1000,
            dataRecreationCostPerHour: 500
        });
        this.assert(impact1.totalImpact > 0, 
            'Very small values should still calculate positive impact', 
            impact1);
        
        // Test 2: Very large values
        const impact2 = RTOMath.calculateRTOImpact({
            rtoHours: 8760, // 1 year
            rpoHours: 8760,
            incidentFrequency: 1,
            revenuePerHour: 1000000,
            dataRecreationCostPerHour: 500000
        });
        this.assert(impact2.totalImpact > 0, 
            'Very large values should calculate correctly', 
            impact2);
        
        // Test 3: Duration formatting
        const formatted1 = RTOMath.formatDuration(0.5);
        this.assert(formatted1.includes('30m'), 
            'Format 0.5 hours as "30m"', 
            { input: 0.5, output: formatted1 });
        
        const formatted2 = RTOMath.formatDuration(25);
        this.assert(formatted2.includes('1d 1h'), 
            'Format 25 hours as "1d 1h"', 
            { input: 25, output: formatted2 });
        
        // Test 4: Cost per incident
        const costPerIncident = RTOMath.calculateCostPerIncident(120000, 12);
        this.assert(Math.abs(costPerIncident - 10000) < 0.01, 
            'Cost per incident: $120,000 ÷ 12 incidents = $10,000', 
            { input: { total: 120000, frequency: 12 }, output: costPerIncident });
    }

    /**
     * Assert test condition
     */
    assert(condition, description, data = null) {
        if (condition) {
            this.passed++;
            console.log(`  ✅ ${description}`);
        } else {
            this.failed++;
            console.log(`  ❌ ${description}`);
            if (data) {
                console.log(`     Data:`, data);
            }
        }
        this.testResults.push({ condition, description, data });
    }

    /**
     * Print test results
     */
    printResults() {
        console.log(`\n📊 Test Results:`);
        console.log(`  ✅ Passed: ${this.passed}`);
        console.log(`  ❌ Failed: ${this.failed}`);
        console.log(`  📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
        
        if (this.failed === 0) {
            console.log(`\n🎉 All tests passed! The RTO/RPO calculator is working correctly.`);
        } else {
            console.log(`\n⚠️  ${this.failed} test(s) failed. Please review the implementation.`);
        }
    }

    /**
     * Run tests automatically in development mode
     */
    autoRunTests() {
        if (this.isDevMode) {
            console.log('🔧 Development mode detected - running tests automatically...');
            setTimeout(() => {
                this.runAllTests();
            }, 1000);
        }
    }
}

// Global test runner function
function runTests() {
    const tests = new RTOCalculatorTests();
    return tests.runAllTests();
}

// Auto-run tests in development mode
if (typeof window !== 'undefined') {
    // Browser environment
    window.RTOCalculatorTests = RTOCalculatorTests;
    window.runTests = runTests;
    
    // Auto-run tests when page loads in dev mode
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof RTOMath !== 'undefined') {
            const tests = new RTOCalculatorTests();
            tests.autoRunTests();
        }
    });
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = RTOCalculatorTests;
}
