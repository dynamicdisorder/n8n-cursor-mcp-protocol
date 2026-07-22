// Comprehensive Unit Tests for Downtime Cost Calculator
class DowntimeCalculatorTests {
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
        console.log('🧪 Running Downtime Cost Calculator Tests...\n');
        
        this.testRevenueCalculation();
        this.testRefundCalculation();
        this.testEmployeeCostCalculation();
        this.testAnnualizedCalculation();
        this.testDurationCalculation();
        this.testInputValidation();
        this.testLocaleParsing();
        this.testCumulativeLossData();
        this.testSparklineFunctionality();
        this.testEdgeCases();
        
        this.printResults();
        return this.failed === 0;
    }

    /**
     * Test revenue calculation: revenue/hour × duration → correct revenue loss
     */
    testRevenueCalculation() {
        console.log('💰 Testing Revenue Calculation...');
        
        // Test 1: Basic revenue calculation
        const revenue1 = DowntimeMath.calculateRevenueLoss(10000, 2.5);
        this.assert(Math.abs(revenue1 - 25000) < 0.01, 
            'Revenue: $10,000/hour × 2.5 hours = $25,000', { input: { rate: 10000, duration: 2.5 }, output: revenue1 });
        
        // Test 2: Zero duration
        const revenue2 = DowntimeMath.calculateRevenueLoss(10000, 0);
        this.assert(revenue2 === 0, 
            'Revenue: $10,000/hour × 0 hours = $0', { input: { rate: 10000, duration: 0 }, output: revenue2 });
        
        // Test 3: Decimal duration
        const revenue3 = DowntimeMath.calculateRevenueLoss(5000, 1.5);
        this.assert(Math.abs(revenue3 - 7500) < 0.01, 
            'Revenue: $5,000/hour × 1.5 hours = $7,500', { input: { rate: 5000, duration: 1.5 }, output: revenue3 });
        
        // Test 4: Very small duration
        const revenue4 = DowntimeMath.calculateRevenueLoss(100000, 0.0167); // 1 minute
        this.assert(Math.abs(revenue4 - 1666.67) < 1, 
            'Revenue: $100,000/hour × 1 minute ≈ $1,666.67', { input: { rate: 100000, duration: 0.0167 }, output: revenue4 });
    }

    /**
     * Test refund calculation: refund % reduces final revenue correctly
     */
    testRefundCalculation() {
        console.log('💸 Testing Refund Calculation...');
        
        // Test 1: Basic refund calculation
        const refund1 = DowntimeMath.calculateRefundCosts(25000, 5);
        this.assert(Math.abs(refund1 - 1250) < 0.01, 
            'Refund: $25,000 × 5% = $1,250', { input: { revenue: 25000, rate: 5 }, output: refund1 });
        
        // Test 2: Zero refund rate
        const refund2 = DowntimeMath.calculateRefundCosts(25000, 0);
        this.assert(refund2 === 0, 
            'Refund: $25,000 × 0% = $0', { input: { revenue: 25000, rate: 0 }, output: refund2 });
        
        // Test 3: High refund rate
        const refund3 = DowntimeMath.calculateRefundCosts(10000, 50);
        this.assert(Math.abs(refund3 - 5000) < 0.01, 
            'Refund: $10,000 × 50% = $5,000', { input: { revenue: 10000, rate: 50 }, output: refund3 });
        
        // Test 4: 100% refund rate
        const refund4 = DowntimeMath.calculateRefundCosts(10000, 100);
        this.assert(Math.abs(refund4 - 10000) < 0.01, 
            'Refund: $10,000 × 100% = $10,000', { input: { revenue: 10000, rate: 100 }, output: refund4 });
    }

    /**
     * Test employee cost calculation: employees × hourly cost × duration
     */
    testEmployeeCostCalculation() {
        console.log('👥 Testing Employee Cost Calculation...');
        
        // Test 1: Basic employee cost calculation
        const empCost1 = DowntimeMath.calculateProductivityLoss(50, 50, 2);
        this.assert(Math.abs(empCost1 - 5000) < 0.01, 
            'Employee Cost: 50 employees × $50/hour × 2 hours = $5,000', 
            { input: { employees: 50, hourlyCost: 50, duration: 2 }, output: empCost1 });
        
        // Test 2: Zero employees
        const empCost2 = DowntimeMath.calculateProductivityLoss(0, 50, 2);
        this.assert(empCost2 === 0, 
            'Employee Cost: 0 employees × $50/hour × 2 hours = $0', 
            { input: { employees: 0, hourlyCost: 50, duration: 2 }, output: empCost2 });
        
        // Test 3: High hourly cost
        const empCost3 = DowntimeMath.calculateProductivityLoss(10, 200, 8);
        this.assert(Math.abs(empCost3 - 16000) < 0.01, 
            'Employee Cost: 10 employees × $200/hour × 8 hours = $16,000', 
            { input: { employees: 10, hourlyCost: 200, duration: 8 }, output: empCost3 });
        
        // Test 4: Decimal duration
        const empCost4 = DowntimeMath.calculateProductivityLoss(25, 75, 1.5);
        this.assert(Math.abs(empCost4 - 2812.5) < 0.01, 
            'Employee Cost: 25 employees × $75/hour × 1.5 hours = $2,812.50', 
            { input: { employees: 25, hourlyCost: 75, duration: 1.5 }, output: empCost4 });
    }

    /**
     * Test annualized calculation: scales correctly with N incidents
     */
    testAnnualizedCalculation() {
        console.log('📅 Testing Annualized Calculation...');
        
        // Test 1: Basic annualized calculation
        const annual1 = DowntimeMath.calculateAnnualizedImpact(10000, 12);
        this.assert(Math.abs(annual1 - 120000) < 0.01, 
            'Annualized: $10,000 × 12 incidents = $120,000', 
            { input: { singleCost: 10000, incidents: 12 }, output: annual1 });
        
        // Test 2: Single incident per year
        const annual2 = DowntimeMath.calculateAnnualizedImpact(50000, 1);
        this.assert(Math.abs(annual2 - 50000) < 0.01, 
            'Annualized: $50,000 × 1 incident = $50,000', 
            { input: { singleCost: 50000, incidents: 1 }, output: annual2 });
        
        // Test 3: High frequency incidents
        const annual3 = DowntimeMath.calculateAnnualizedImpact(5000, 365);
        this.assert(Math.abs(annual3 - 1825000) < 0.01, 
            'Annualized: $5,000 × 365 incidents = $1,825,000', 
            { input: { singleCost: 5000, incidents: 365 }, output: annual3 });
        
        // Test 4: Zero incidents
        const annual4 = DowntimeMath.calculateAnnualizedImpact(10000, 0);
        this.assert(annual4 === 0, 
            'Annualized: $10,000 × 0 incidents = $0', 
            { input: { singleCost: 10000, incidents: 0 }, output: annual4 });
    }

    /**
     * Test duration calculation with different input methods
     */
    testDurationCalculation() {
        console.log('⏱️ Testing Duration Calculation...');
        
        // Test 1: Hours and minutes
        const duration1 = DowntimeMath.calculateDuration(2, 30);
        this.assert(Math.abs(duration1 - 2.5) < 0.01, 
            'Duration: 2 hours 30 minutes = 2.5 hours', 
            { input: { hours: 2, minutes: 30 }, output: duration1 });
        
        // Test 2: Only minutes
        const duration2 = DowntimeMath.calculateDuration(0, 90);
        this.assert(Math.abs(duration2 - 1.5) < 0.01, 
            'Duration: 0 hours 90 minutes = 1.5 hours', 
            { input: { hours: 0, minutes: 90 }, output: duration2 });
        
        // Test 3: Only hours
        const duration3 = DowntimeMath.calculateDuration(4, 0);
        this.assert(Math.abs(duration3 - 4) < 0.01, 
            'Duration: 4 hours 0 minutes = 4 hours', 
            { input: { hours: 4, minutes: 0 }, output: duration3 });
        
        // Test 4: Timestamps
        const startTime = new Date('2024-01-01T10:00:00');
        const endTime = new Date('2024-01-01T12:30:00');
        const duration4 = DowntimeMath.calculateDuration(0, 0, startTime, endTime);
        this.assert(Math.abs(duration4 - 2.5) < 0.01, 
            'Duration: 10:00 to 12:30 = 2.5 hours', 
            { input: { startTime: '10:00', endTime: '12:30' }, output: duration4 });
    }

    /**
     * Test input validation
     */
    testInputValidation() {
        console.log('✅ Testing Input Validation...');
        
        // Test 1: Valid inputs
        const validInputs = {
            revenuePerHour: 10000,
            durationHours: 2.5,
            refundRate: 5,
            conversionDropRate: 15,
            affectedEmployees: 50,
            hourlyCostPerEmployee: 50
        };
        const validation1 = DowntimeMath.validateInputs(validInputs);
        this.assert(validation1.valid, 
            'Valid inputs should pass validation', validation1);
        
        // Test 2: Invalid revenue per hour
        const invalidInputs1 = { ...validInputs, revenuePerHour: 0 };
        const validation2 = DowntimeMath.validateInputs(invalidInputs1);
        this.assert(!validation2.valid, 
            'Zero revenue per hour should fail validation', validation2);
        
        // Test 3: Invalid refund rate
        const invalidInputs2 = { ...validInputs, refundRate: 150 };
        const validation3 = DowntimeMath.validateInputs(invalidInputs2);
        this.assert(!validation3.valid, 
            'Refund rate > 100% should fail validation', validation3);
        
        // Test 4: Long duration warning
        const longDurationInputs = { ...validInputs, durationHours: 200 };
        const validation4 = DowntimeMath.validateInputs(longDurationInputs);
        this.assert(validation4.valid && validation4.warnings.length > 0, 
            'Long duration should generate warning', validation4);
    }

    /**
     * Test locale number parsing
     */
    testLocaleParsing() {
        console.log('🌍 Testing Locale Parsing...');
        
        // Test 1: Standard decimal
        const parsed1 = DowntimeMath.parseLocaleNumber('10000.50');
        this.assert(parsed1 === 10000.50, 
            'Parse "10000.50" → 10000.50', { input: '10000.50', output: parsed1 });
        
        // Test 2: Comma decimal separator
        const parsed2 = DowntimeMath.parseLocaleNumber('10000,50');
        this.assert(parsed2 === 10000.50, 
            'Parse "10000,50" → 10000.50', { input: '10000,50', output: parsed2 });
        
        // Test 3: Currency symbols
        const parsed3 = DowntimeMath.parseLocaleNumber('$10,000.50');
        this.assert(parsed3 === 10000.50, 
            'Parse "$10,000.50" → 10000.50', { input: '$10,000.50', output: parsed3 });
        
        // Test 4: Empty string
        const parsed4 = DowntimeMath.parseLocaleNumber('');
        this.assert(parsed4 === 0, 
            'Parse empty string → 0', { input: '', output: parsed4 });
    }

    /**
     * Test cumulative loss data generation
     */
    testCumulativeLossData() {
        console.log('📊 Testing Cumulative Loss Data...');
        
        // Test 1: Basic cumulative data
        const data1 = DowntimeMath.generateCumulativeLossData(1000, 2, 5);
        this.assert(data1.length === 6, 
            'Generate 5 points + start = 6 data points', { input: { total: 1000, duration: 2, points: 5 }, output: data1.length });
        
        // Test 2: Data progression
        const data2 = DowntimeMath.generateCumulativeLossData(100, 1, 4);
        this.assert(data2[0] === 0 && data2[4] === 100, 
            'Cumulative data starts at 0, ends at total', { input: { total: 100, duration: 1, points: 4 }, output: data2 });
        
        // Test 3: Linear progression
        const data3 = DowntimeMath.generateCumulativeLossData(1000, 1, 10);
        const expected = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
        const isLinear = data3.every((val, i) => Math.abs(val - expected[i]) < 0.01);
        this.assert(isLinear, 
            'Cumulative data should be linear progression', { input: { total: 1000, duration: 1, points: 10 }, output: data3 });
    }

    /**
     * Test sparkline functionality
     */
    testSparklineFunctionality() {
        console.log('📈 Testing Sparkline Functionality...');
        
        // Test 1: Basic sparkline drawing
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 60;
        const data = [0, 25, 50, 75, 100];
        
        try {
            Sparkline.draw(canvas, data);
            this.assert(true, 'Sparkline drawing should not throw errors', { data });
        } catch (error) {
            this.assert(false, 'Sparkline drawing should not throw errors', { error: error.message });
        }
        
        // Test 2: Empty data handling
        try {
            Sparkline.draw(canvas, []);
            this.assert(true, 'Sparkline should handle empty data gracefully', { data: [] });
        } catch (error) {
            this.assert(false, 'Sparkline should handle empty data gracefully', { error: error.message });
        }
        
        // Test 3: Single data point
        try {
            Sparkline.draw(canvas, [100]);
            this.assert(true, 'Sparkline should handle single data point', { data: [100] });
        } catch (error) {
            this.assert(false, 'Sparkline should handle single data point', { error: error.message });
        }
    }

    /**
     * Test edge cases and error conditions
     */
    testEdgeCases() {
        console.log('🔍 Testing Edge Cases...');
        
        // Test 1: Zero values
        const zeroResult = DowntimeMath.calculateDowntimeCost({
            revenuePerHour: 0,
            durationHours: 2,
            refundRate: 5,
            conversionDropRate: 15,
            affectedEmployees: 50,
            hourlyCostPerEmployee: 50
        });
        this.assert(zeroResult.totalLoss > 0, 
            'Zero revenue should still calculate employee costs', zeroResult);
        
        // Test 2: Very small duration
        const smallDuration = DowntimeMath.calculateDowntimeCost({
            revenuePerHour: 100000,
            durationHours: 0.001, // 3.6 seconds
            refundRate: 0,
            conversionDropRate: 0,
            affectedEmployees: 0,
            hourlyCostPerEmployee: 0
        });
        this.assert(smallDuration.totalLoss > 0, 
            'Very small duration should still calculate some loss', smallDuration);
        
        // Test 3: Maximum values
        const maxValues = DowntimeMath.calculateDowntimeCost({
            revenuePerHour: 1000000,
            durationHours: 24,
            refundRate: 100,
            conversionDropRate: 100,
            affectedEmployees: 1000,
            hourlyCostPerEmployee: 1000
        });
        this.assert(maxValues.totalLoss > 0, 
            'Maximum values should calculate correctly', maxValues);
        
        // Test 4: Duration formatting
        const formatted1 = DowntimeMath.formatDuration(2.5);
        this.assert(formatted1.includes('2h 30m'), 
            'Format 2.5 hours as "2h 30m"', { input: 2.5, output: formatted1 });
        
        const formatted2 = DowntimeMath.formatDuration(0.5);
        this.assert(formatted2.includes('30 minutes'), 
            'Format 0.5 hours as "30 minutes"', { input: 0.5, output: formatted2 });
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
            console.log(`\n🎉 All tests passed! The downtime calculator is working correctly.`);
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
    const tests = new DowntimeCalculatorTests();
    return tests.runAllTests();
}

// Auto-run tests in development mode
if (typeof window !== 'undefined') {
    // Browser environment
    window.DowntimeCalculatorTests = DowntimeCalculatorTests;
    window.runTests = runTests;
    
    // Auto-run tests when page loads in dev mode
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof DowntimeMath !== 'undefined') {
            const tests = new DowntimeCalculatorTests();
            tests.autoRunTests();
        }
    });
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = DowntimeCalculatorTests;
}
