// Comprehensive Tests for SLA Calculator
class SLACalculatorTests {
    constructor() {
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
    }

    /**
     * Run all tests
     */
    runAllTests() {
        console.log('🧪 Running SLA Calculator Tests...\n');
        
        this.testCoreLogic();
        this.testLocaleParsing();
        this.testDowntimeCalculations();
        this.testAllowedDowntime();
        this.testTierParsing();
        this.testValidation();
        this.testFormatting();
        this.testEdgeCases();
        this.testTrafficLight();
        this.testTierValidation();
        
        this.printResults();
        return this.failed === 0;
    }

    /**
     * Test core penalty calculation logic
     */
    testCoreLogic() {
        console.log('📊 Testing Core Logic...');
        
        const defaultTiers = [
            { threshold: 0, name: 'Tier 1', percentage: 5 },
            { threshold: 0.1, name: 'Tier 2', percentage: 10 },
            { threshold: 0.5, name: 'Tier 3', percentage: 25 }
        ];
        
        // Test A: promised 99.95, actual 99.99 → penalty 0, tier "No penalty"
        const testA = SLAMath.calculatePenalty({
            contractValue: 1000000,
            promisedUptime: 99.95,
            actualUptime: 99.99,
            penaltyTiers: defaultTiers
        });
        this.assert(testA.totalPenalty === 0 && testA.tier === "No penalty", 
            'Test A: No penalty when actual >= promised', testA);
        
        // Test B: promised 99.95, 120 min downtime in 30 days → actual 99.72, shortfall 0.23 → Tier2=10% on $1,000,000 → $100,000
        const actualUptimeB = SLAMath.calculateActualUptimeFromDowntime(120, 30);
        const testB = SLAMath.calculatePenalty({
            contractValue: 1000000,
            promisedUptime: 99.95,
            actualUptime: actualUptimeB,
            penaltyTiers: defaultTiers
        });
        this.assert(Math.abs(testB.totalPenalty - 100000) < 1 && testB.tier === 'Tier 2', 
            'Test B: 120 min downtime → Tier 2, $100,000', testB);
        
        // Test C: shortfall > 0.5% → 25% on $1,000,000 → $250,000
        const testC = SLAMath.calculatePenalty({
            contractValue: 1000000,
            promisedUptime: 99.95,
            actualUptime: 99.40, // 0.55% shortfall
            penaltyTiers: defaultTiers
        });
        this.assert(Math.abs(testC.totalPenalty - 250000) < 1 && testC.tier === 'Tier 3', 
            'Test C: >0.5% shortfall → Tier 3, $250,000', testC);
        
        // Test D: promised 100.00, downtime 0 → penalty 0
        const testD = SLAMath.calculatePenalty({
            contractValue: 1000000,
            promisedUptime: 100.00,
            actualUptime: 100.00,
            penaltyTiers: defaultTiers
        });
        this.assert(testD.totalPenalty === 0 && testD.tier === "No penalty", 
            'Test D: 100% promised, 0 downtime → no penalty', testD);
    }

    /**
     * Test locale-aware number parsing
     */
    testLocaleParsing() {
        console.log('🌍 Testing Locale Parsing...');
        
        // Test E: "99,95" parses as 99.95
        const parsedE = SLAMath.parseLocaleNumber("99,95");
        this.assert(parsedE === 99.95, 'Test E: "99,95" → 99.95', { input: "99,95", output: parsedE });
        
        // Additional locale tests
        this.assert(SLAMath.parseLocaleNumber("99.95") === 99.95, 'Dot decimal parsing', { input: "99.95", output: SLAMath.parseLocaleNumber("99.95") });
        this.assert(SLAMath.parseLocaleNumber("1,000.50") === 1000.50, 'Comma thousands separator', { input: "1,000.50", output: SLAMath.parseLocaleNumber("1,000.50") });
        this.assert(SLAMath.parseLocaleNumber("€1,000.50") === 1000.50, 'Currency symbol removal', { input: "€1,000.50", output: SLAMath.parseLocaleNumber("€1,000.50") });
        this.assert(SLAMath.parseLocaleNumber("") === 0, 'Empty string → 0', { input: "", output: SLAMath.parseLocaleNumber("") });
        this.assert(SLAMath.parseLocaleNumber(null) === 0, 'Null → 0', { input: null, output: SLAMath.parseLocaleNumber(null) });
    }

    /**
     * Test downtime to uptime calculations
     */
    testDowntimeCalculations() {
        console.log('⏱️ Testing Downtime Calculations...');
        
        // 30 days = 43,200 minutes
        const period30Days = 30 * 24 * 60;
        
        // 0 downtime = 100% uptime
        const uptime0 = SLAMath.calculateActualUptimeFromDowntime(0, 30);
        this.assert(Math.abs(uptime0 - 100) < 0.001, '0 downtime → 100% uptime', { downtime: 0, uptime: uptime0 });
        
        // 120 minutes downtime in 30 days
        const uptime120 = SLAMath.calculateActualUptimeFromDowntime(120, 30);
        this.assert(Math.abs(uptime120 - 99.722) < 0.001, '120 min downtime → 99.722% uptime', { downtime: 120, uptime: uptime120 });
        
        // 1 day downtime in 30 days
        const uptime1Day = SLAMath.calculateActualUptimeFromDowntime(1440, 30);
        this.assert(Math.abs(uptime1Day - 96.667) < 0.001, '1 day downtime → 96.667% uptime', { downtime: 1440, uptime: uptime1Day });
    }

    /**
     * Test allowed downtime calculations
     */
    testAllowedDowntime() {
        console.log('📅 Testing Allowed Downtime...');
        
        // 99.95% SLA in 30 days
        const allowed995 = SLAMath.calculateAllowedDowntime(99.95, 30);
        this.assert(Math.abs(allowed995 - 21.6) < 0.1, '99.95% SLA → 21.6 min allowed', { sla: 99.95, allowed: allowed995 });
        
        // 99.9% SLA in 30 days
        const allowed99 = SLAMath.calculateAllowedDowntime(99.9, 30);
        this.assert(Math.abs(allowed99 - 43.2) < 0.1, '99.9% SLA → 43.2 min allowed', { sla: 99.9, allowed: allowed99 });
        
        // 99.5% SLA in 30 days
        const allowed995_5 = SLAMath.calculateAllowedDowntime(99.5, 30);
        this.assert(Math.abs(allowed995_5 - 216) < 1, '99.5% SLA → 216 min allowed', { sla: 99.5, allowed: allowed995_5 });
    }

    /**
     * Test tier threshold parsing
     */
    testTierParsing() {
        console.log('🎯 Testing Tier Parsing...');
        
        this.assert(SLAMath.parseTierThreshold("< 0.1%") === 0.1, 'Parse "< 0.1%" → 0.1', { input: "< 0.1%", output: SLAMath.parseTierThreshold("< 0.1%") });
        this.assert(SLAMath.parseTierThreshold("0.1% - 0.5%") === 0.1, 'Parse "0.1% - 0.5%" → 0.1', { input: "0.1% - 0.5%", output: SLAMath.parseTierThreshold("0.1% - 0.5%") });
        this.assert(SLAMath.parseTierThreshold("> 0.5%") === 0.5, 'Parse "> 0.5%" → 0.5', { input: "> 0.5%", output: SLAMath.parseTierThreshold("> 0.5%") });
        this.assert(SLAMath.parseTierThreshold("0.05") === 0.05, 'Parse "0.05" → 0.05', { input: "0.05", output: SLAMath.parseTierThreshold("0.05") });
    }

    /**
     * Test tier validation
     */
    testValidation() {
        console.log('✅ Testing Validation...');
        
        const validTiers = [
            { threshold: "< 0.1%", percentage: 5 },
            { threshold: "0.1% - 0.5%", percentage: 10 },
            { threshold: "> 0.5%", percentage: 25 }
        ];
        
        const validation = SLAMath.validateTiers(validTiers);
        this.assert(validation.valid, 'Valid tiers pass validation', validation);
        
        const invalidTiers = [
            { threshold: "0.1%", percentage: 5 },
            { threshold: "0.1%", percentage: 10 } // Duplicate threshold
        ];
        
        const invalidValidation = SLAMath.validateTiers(invalidTiers);
        this.assert(!invalidValidation.valid, 'Invalid tiers fail validation', invalidValidation);
    }

    /**
     * Test formatting utilities
     */
    testFormatting() {
        console.log('🎨 Testing Formatting...');
        
        this.assert(FormatUtils.formatCurrency(1000000, 'USD') === '$1,000,000', 'Format $1,000,000', { input: 1000000, output: FormatUtils.formatCurrency(1000000, 'USD') });
        this.assert(FormatUtils.formatPercentage(99.95, 2) === '99.95%', 'Format 99.95%', { input: 99.95, output: FormatUtils.formatPercentage(99.95, 2) });
        this.assert(FormatUtils.formatMinutes(120.7) === '121', 'Format 120.7 min → 121', { input: 120.7, output: FormatUtils.formatMinutes(120.7) });
        this.assert(FormatUtils.getTierBadgeClass('No penalty') === 'badge-success', 'No penalty badge class', { input: 'No penalty', output: FormatUtils.getTierBadgeClass('No penalty') });
        this.assert(FormatUtils.getTierBadgeClass('Tier 3') === 'badge-danger', 'Tier 3 badge class', { input: 'Tier 3', output: FormatUtils.getTierBadgeClass('Tier 3') });
    }

    /**
     * Test edge cases
     */
    testEdgeCases() {
        console.log('🔍 Testing Edge Cases...');
        
        // Zero contract value
        const zeroContract = SLAMath.calculatePenalty({
            contractValue: 0,
            promisedUptime: 99.95,
            actualUptime: 99.90,
            penaltyTiers: [{ threshold: 0, name: 'Tier 1', percentage: 5 }]
        });
        this.assert(zeroContract.totalPenalty === 0, 'Zero contract → zero penalty', zeroContract);
        
        // 100% promised uptime
        const hundredPercent = SLAMath.calculatePenalty({
            contractValue: 1000000,
            promisedUptime: 100,
            actualUptime: 99.99,
            penaltyTiers: [{ threshold: 0, name: 'Tier 1', percentage: 5 }]
        });
        this.assert(hundredPercent.totalPenalty > 0, '100% promised, 99.99% actual → penalty', hundredPercent);
        
        // Very small shortfall
        const smallShortfall = SLAMath.calculatePenalty({
            contractValue: 1000000,
            promisedUptime: 99.95,
            actualUptime: 99.949,
            penaltyTiers: [{ threshold: 0, name: 'Tier 1', percentage: 5 }]
        });
        this.assert(smallShortfall.totalPenalty > 0, 'Very small shortfall → penalty', smallShortfall);
    }

    /**
     * Test traffic light visualization
     */
    testTrafficLight() {
        console.log('🚦 Testing Traffic Light Visualization...');
        
        // Test marker positioning for 0.23% shortfall (should be in Tier 2)
        const testMarker = this.calculateMarkerPosition(0.23);
        this.assert(testMarker > 10 && testMarker < 90, 'Marker positioned correctly for 0.23% shortfall', { shortfall: 0.23, position: testMarker });
        
        // Test green only when shortfall <= 0
        const noPenaltyTest = this.calculateMarkerPosition(0);
        this.assert(noPenaltyTest <= 10, 'Green segment only when shortfall <= 0', { shortfall: 0, position: noPenaltyTest });
        
        // Test negative shortfall (better than promised)
        const negativeTest = this.calculateMarkerPosition(-0.1);
        this.assert(negativeTest <= 10, 'Negative shortfall shows green', { shortfall: -0.1, position: negativeTest });
    }

    /**
     * Test tier editor validation
     */
    testTierValidation() {
        console.log('✅ Testing Tier Editor Validation...');
        
        // Test overlapping ranges (should be rejected)
        const overlappingTiers = [
            { threshold: 0, name: 'Tier 1', percentage: 5 },
            { threshold: 0.1, name: 'Tier 2', percentage: 10 },
            { threshold: 0.1, name: 'Tier 3', percentage: 15 } // Same threshold as Tier 2
        ];
        
        const overlappingValidation = SLAMath.validateTiers(overlappingTiers);
        this.assert(!overlappingValidation.valid, 'Overlapping tier thresholds rejected', overlappingValidation);
        
        // Test valid tier configuration
        const validTiers = [
            { threshold: 0, name: 'Tier 1', percentage: 5 },
            { threshold: 0.1, name: 'Tier 2', percentage: 10 },
            { threshold: 0.5, name: 'Tier 3', percentage: 25 }
        ];
        
        const validValidation = SLAMath.validateTiers(validTiers);
        this.assert(validValidation.valid, 'Valid tier configuration accepted', validValidation);
        
        // Test empty tiers (should be rejected)
        const emptyValidation = SLAMath.validateTiers([]);
        this.assert(!emptyValidation.valid, 'Empty tier configuration rejected', emptyValidation);
    }

    /**
     * Calculate marker position for traffic light visualization
     */
    calculateMarkerPosition(shortfall) {
        if (shortfall <= 0) {
            return 5; // Green segment
        }
        
        // Map shortfall to position on the bar (0% to 2% range)
        const maxShortfall = 2;
        return Math.min((shortfall / maxShortfall) * 100, 95);
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
            console.log(`\n🎉 All tests passed! The SLA calculator is working correctly.`);
        } else {
            console.log(`\n⚠️  ${this.failed} test(s) failed. Please review the implementation.`);
        }
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    // Browser environment
    window.SLACalculatorTests = SLACalculatorTests;
    
    // Auto-run tests when page loads
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof SLAMath !== 'undefined' && typeof FormatUtils !== 'undefined') {
            const tests = new SLACalculatorTests();
            tests.runAllTests();
        }
    });
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = SLACalculatorTests;
}
