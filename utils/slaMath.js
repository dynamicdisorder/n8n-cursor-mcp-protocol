// SLA Math Utilities - Core calculation logic
class SLAMath {
    /**
     * Parse locale-aware numeric input (supports both comma and dot decimals)
     * @param {string|number} input - Input string or number
     * @returns {number} - Parsed number normalized to dot decimal
     */
    static parseLocaleNumber(input) {
        if (typeof input === 'number') return input;
        if (!input || typeof input !== 'string') return 0;
        
        // Remove whitespace and currency symbols
        let cleaned = input.replace(/[\s$€,]/g, '');
        
        // Handle comma as decimal separator (European style like "99,95")
        if (cleaned.includes(',') && !cleaned.includes('.')) {
            cleaned = cleaned.replace(',', '.');
        }
        
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    /**
     * Calculate actual uptime from downtime minutes
     * @param {number} downtimeMinutes - Total downtime in minutes
     * @param {number} periodDays - Period in days (default 30)
     * @returns {number} - Actual uptime percentage
     */
    static calculateActualUptimeFromDowntime(downtimeMinutes, periodDays = 30) {
        const periodMinutes = periodDays * 24 * 60;
        const uptimeMinutes = periodMinutes - downtimeMinutes;
        return Math.max(0, (uptimeMinutes / periodMinutes) * 100);
    }

    /**
     * Calculate allowed downtime for given SLA and period
     * @param {number} promisedUptime - Promised uptime percentage
     * @param {number} periodDays - Period in days
     * @returns {number} - Allowed downtime in minutes
     */
    static calculateAllowedDowntime(promisedUptime, periodDays = 30) {
        const periodMinutes = periodDays * 24 * 60;
        return periodMinutes * (1 - promisedUptime / 100);
    }

    /**
     * Calculate SLA penalty
     * @param {Object} params - Calculation parameters
     * @param {number} params.contractValue - Contract value
     * @param {number} params.promisedUptime - Promised uptime percentage
     * @param {number} params.actualUptime - Actual uptime percentage
     * @param {Array} params.penaltyTiers - Array of penalty tiers
     * @returns {Object} - Calculation result
     */
    static calculatePenalty(params) {
        const { contractValue, promisedUptime, actualUptime, penaltyTiers } = params;
        
        // Parse inputs
        const contract = this.parseLocaleNumber(contractValue);
        const promised = this.parseLocaleNumber(promisedUptime);
        const actual = this.parseLocaleNumber(actualUptime);
        
        // If actual uptime >= promised uptime, no penalty
        if (actual >= promised) {
            return {
                totalPenalty: 0,
                tier: "No penalty",
                shortfall: 0,
                appliedPercentage: 0,
                actualUptime: actual,
                promisedUptime: promised
            };
        }
        
        // Calculate shortfall (clamped at 0)
        const shortfall = Math.max(0, promised - actual);
        
        // Find applicable tier
        const tier = this.findApplicableTier(shortfall, penaltyTiers);
        
        // Calculate penalty
        const totalPenalty = contract * (tier.percentage / 100);
        
        return {
            totalPenalty,
            tier: tier.name,
            shortfall,
            appliedPercentage: tier.percentage,
            actualUptime: actual,
            promisedUptime: promised
        };
    }

    /**
     * Find applicable penalty tier based on shortfall
     * @param {number} shortfall - Uptime shortfall percentage
     * @param {Array} tiers - Array of penalty tiers
     * @returns {Object} - Applicable tier
     */
    static findApplicableTier(shortfall, tiers) {
        // Sort tiers by threshold (ascending)
        const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold);
        
        // Find the highest applicable tier
        let applicableTier = sortedTiers[0]; // Default to first tier
        
        for (const tier of sortedTiers) {
            if (shortfall >= tier.threshold) {
                applicableTier = tier;
            } else {
                break;
            }
        }
        
        return applicableTier;
    }

    /**
     * Parse penalty tier from threshold string
     * @param {string} thresholdStr - Threshold string like "< 0.1%" or "0.1% - 0.5%"
     * @returns {number} - Numeric threshold
     */
    static parseTierThreshold(thresholdStr) {
        if (!thresholdStr) return 0;
        
        // If it's already a number, return it
        if (typeof thresholdStr === 'number') return thresholdStr;
        
        // Convert to string if it's not already
        const str = String(thresholdStr);
        
        // Remove % and spaces
        let cleaned = str.replace(/[%\s]/g, '');
        
        // Handle different formats
        if (cleaned.startsWith('<')) {
            // "< 0.1" -> 0.1
            return this.parseLocaleNumber(cleaned.substring(1));
        } else if (cleaned.includes('-')) {
            // "0.1-0.5" -> 0.1 (use lower bound)
            const parts = cleaned.split('-');
            return this.parseLocaleNumber(parts[0]);
        } else if (cleaned.startsWith('>')) {
            // "> 0.5" -> 0.5
            return this.parseLocaleNumber(cleaned.substring(1));
        } else {
            // Direct number
            return this.parseLocaleNumber(cleaned);
        }
    }

    /**
     * Validate penalty tiers for consistency
     * @param {Array} tiers - Array of penalty tiers
     * @returns {Object} - Validation result
     */
    static validateTiers(tiers) {
        const errors = [];
        const warnings = [];
        
        if (!tiers || tiers.length === 0) {
            errors.push("At least one penalty tier is required");
            return { valid: false, errors, warnings };
        }
        
        // Check for duplicate thresholds
        const thresholds = tiers.map(tier => this.parseTierThreshold(tier.threshold));
        const uniqueThresholds = new Set(thresholds);
        if (thresholds.length !== uniqueThresholds.size) {
            errors.push("Duplicate tier thresholds found");
        }
        
        // Check for overlapping ranges
        const sortedTiers = [...tiers].sort((a, b) => 
            this.parseTierThreshold(a.threshold) - this.parseTierThreshold(b.threshold)
        );
        
        for (let i = 0; i < sortedTiers.length - 1; i++) {
            const current = this.parseTierThreshold(sortedTiers[i].threshold);
            const next = this.parseTierThreshold(sortedTiers[i + 1].threshold);
            
            if (current >= next) {
                warnings.push(`Tier ${i + 1} threshold (${current}%) should be less than tier ${i + 2} threshold (${next}%)`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SLAMath;
}
