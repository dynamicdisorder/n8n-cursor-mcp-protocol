// Downtime Cost Calculation Utilities
class DowntimeMath {
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
     * Calculate total downtime duration in hours
     * @param {number} hours - Hours component
     * @param {number} minutes - Minutes component
     * @param {Date} startTime - Optional start timestamp
     * @param {Date} endTime - Optional end timestamp
     * @returns {number} - Total duration in hours
     */
    static calculateDuration(hours = 0, minutes = 0, startTime = null, endTime = null) {
        // If timestamps are provided, calculate duration from them
        if (startTime && endTime) {
            const durationMs = endTime.getTime() - startTime.getTime();
            if (durationMs < 0) return 0; // Invalid range
            return durationMs / (1000 * 60 * 60); // Convert to hours
        }
        
        // Otherwise use hours and minutes
        const totalMinutes = (hours * 60) + minutes;
        return totalMinutes / 60; // Convert to hours
    }

    /**
     * Calculate revenue loss during downtime
     * @param {number} revenuePerHour - Revenue per hour
     * @param {number} durationHours - Duration in hours
     * @returns {number} - Revenue loss amount
     */
    static calculateRevenueLoss(revenuePerHour, durationHours) {
        return revenuePerHour * durationHours;
    }

    /**
     * Calculate refund costs based on revenue loss
     * @param {number} revenueLoss - Total revenue loss
     * @param {number} refundRate - Refund rate percentage (0-100)
     * @returns {number} - Refund cost amount
     */
    static calculateRefundCosts(revenueLoss, refundRate) {
        return revenueLoss * (refundRate / 100);
    }

    /**
     * Calculate productivity loss from affected employees
     * @param {number} affectedEmployees - Number of affected employees
     * @param {number} hourlyCostPerEmployee - Hourly cost per employee
     * @param {number} durationHours - Duration in hours
     * @returns {number} - Productivity loss amount
     */
    static calculateProductivityLoss(affectedEmployees, hourlyCostPerEmployee, durationHours) {
        return affectedEmployees * hourlyCostPerEmployee * durationHours;
    }

    /**
     * Calculate conversion drop impact
     * @param {number} revenueLoss - Total revenue loss
     * @param {number} conversionDropRate - Conversion drop percentage (0-100)
     * @returns {number} - Conversion drop impact
     */
    static calculateConversionDropImpact(revenueLoss, conversionDropRate) {
        return revenueLoss * (conversionDropRate / 100);
    }

    /**
     * Calculate total downtime cost
     * @param {Object} params - Calculation parameters
     * @param {number} params.revenuePerHour - Revenue per hour
     * @param {number} params.durationHours - Duration in hours
     * @param {number} params.refundRate - Refund rate percentage
     * @param {number} params.conversionDropRate - Conversion drop percentage
     * @param {number} params.affectedEmployees - Number of affected employees
     * @param {number} params.hourlyCostPerEmployee - Hourly cost per employee
     * @returns {Object} - Detailed cost breakdown
     */
    static calculateDowntimeCost(params) {
        const {
            revenuePerHour,
            durationHours,
            refundRate,
            conversionDropRate,
            affectedEmployees,
            hourlyCostPerEmployee
        } = params;

        // Calculate individual cost components
        const revenueLoss = this.calculateRevenueLoss(revenuePerHour, durationHours);
        const refundCosts = this.calculateRefundCosts(revenueLoss, refundRate);
        const productivityLoss = this.calculateProductivityLoss(
            affectedEmployees,
            hourlyCostPerEmployee,
            durationHours
        );
        const conversionDropImpact = this.calculateConversionDropImpact(revenueLoss, conversionDropRate);

        // Calculate total loss
        const totalLoss = revenueLoss + refundCosts + productivityLoss + conversionDropImpact;

        return {
            revenueLoss,
            refundCosts,
            productivityLoss,
            conversionDropImpact,
            totalLoss,
            durationHours
        };
    }

    /**
     * Calculate annualized impact
     * @param {number} singleIncidentCost - Cost of single incident
     * @param {number} incidentsPerYear - Expected incidents per year
     * @returns {number} - Annualized cost
     */
    static calculateAnnualizedImpact(singleIncidentCost, incidentsPerYear) {
        return singleIncidentCost * incidentsPerYear;
    }

    /**
     * Generate cumulative loss data points for sparkline
     * @param {number} totalLoss - Total loss amount
     * @param {number} durationHours - Duration in hours
     * @param {number} points - Number of data points (default 20)
     * @returns {Array} - Array of cumulative loss values
     */
    static generateCumulativeLossData(totalLoss, durationHours, points = 20) {
        const data = [];
        const increment = totalLoss / points;
        
        for (let i = 0; i <= points; i++) {
            data.push(i * increment);
        }
        
        return data;
    }

    /**
     * Validate input parameters
     * @param {Object} params - Input parameters
     * @returns {Object} - Validation result
     */
    static validateInputs(params) {
        const errors = [];
        const warnings = [];

        const {
            revenuePerHour,
            durationHours,
            refundRate,
            conversionDropRate,
            affectedEmployees,
            hourlyCostPerEmployee
        } = params;

        // Required fields
        if (!revenuePerHour || revenuePerHour <= 0) {
            errors.push("Revenue per hour must be greater than 0");
        }

        if (!durationHours || durationHours <= 0) {
            errors.push("Duration must be greater than 0 hours");
        }

        if (durationHours > 168) { // More than a week
            warnings.push("Duration exceeds 1 week - consider if this is realistic");
        }

        // Optional field validations
        if (refundRate < 0 || refundRate > 100) {
            errors.push("Refund rate must be between 0 and 100 percent");
        }

        if (conversionDropRate < 0 || conversionDropRate > 100) {
            errors.push("Conversion drop rate must be between 0 and 100 percent");
        }

        if (affectedEmployees < 0) {
            errors.push("Number of affected employees cannot be negative");
        }

        if (hourlyCostPerEmployee < 0) {
            errors.push("Hourly cost per employee cannot be negative");
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Format duration for display
     * @param {number} hours - Duration in hours
     * @returns {string} - Formatted duration string
     */
    static formatDuration(hours) {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        
        if (wholeHours === 0) {
            return `${minutes} minutes`;
        } else if (minutes === 0) {
            return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
        } else {
            return `${wholeHours}h ${minutes}m`;
        }
    }

    /**
     * Calculate cost per minute
     * @param {number} totalCost - Total cost
     * @param {number} durationHours - Duration in hours
     * @returns {number} - Cost per minute
     */
    static calculateCostPerMinute(totalCost, durationHours) {
        const durationMinutes = durationHours * 60;
        return durationMinutes > 0 ? totalCost / durationMinutes : 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DowntimeMath;
}
