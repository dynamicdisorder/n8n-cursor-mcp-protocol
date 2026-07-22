// Formatting Utilities
class FormatUtils {
    /**
     * Format currency amount
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (USD, EUR)
     * @returns {string} - Formatted currency string
     */
    static formatCurrency(amount, currency = 'USD') {
        const options = {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        };
        
        try {
            return new Intl.NumberFormat('en-US', options).format(amount);
        } catch (error) {
            // Fallback for unsupported currencies
            return `${currency} ${Math.round(amount).toLocaleString()}`;
        }
    }

    /**
     * Format percentage with specified decimal places
     * @param {number} value - Percentage value
     * @param {number} decimals - Number of decimal places (default 2)
     * @returns {string} - Formatted percentage string
     */
    static formatPercentage(value, decimals = 2) {
        return `${value.toFixed(decimals)}%`;
    }

    /**
     * Format minutes as whole number
     * @param {number} minutes - Minutes to format
     * @returns {string} - Formatted minutes string
     */
    static formatMinutes(minutes) {
        return Math.round(minutes).toString();
    }

    /**
     * Format large numbers with appropriate suffixes
     * @param {number} value - Number to format
     * @returns {string} - Formatted number string
     */
    static formatLargeNumber(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toLocaleString();
    }

    /**
     * Get tier badge class based on tier name
     * @param {string} tierName - Tier name
     * @returns {string} - CSS class name
     */
    static getTierBadgeClass(tierName) {
        switch (tierName.toLowerCase()) {
            case 'no penalty':
                return 'badge-success';
            case 'tier 1':
                return 'badge-warning';
            case 'tier 2':
                return 'badge-orange';
            case 'tier 3':
                return 'badge-danger';
            default:
                return 'badge-secondary';
        }
    }

    /**
     * Get tier color for traffic light visualization
     * @param {string} tierName - Tier name
     * @returns {string} - Hex color code
     */
    static getTierColor(tierName) {
        switch (tierName.toLowerCase()) {
            case 'no penalty':
                return '#16a34a'; // Green
            case 'tier 1':
                return '#f59e0b'; // Yellow
            case 'tier 2':
                return '#fb923c'; // Orange
            case 'tier 3':
                return '#ef4444'; // Red
            default:
                return '#6b7280'; // Gray
        }
    }

    /**
     * Create explanation text for penalty calculation
     * @param {Object} result - Calculation result from SLAMath.calculatePenalty
     * @param {number} contractValue - Contract value
     * @returns {string} - Explanation text
     */
    static createExplanation(result, contractValue) {
        const { tier, shortfall, appliedPercentage, actualUptime, promisedUptime } = result;
        
        if (tier === "No penalty") {
            return `Your uptime met or exceeded the SLA. No penalty applies.`;
        }
        
        return `Falls into ${tier} (${appliedPercentage}% of contract).`;
    }

    /**
     * Create detailed explanation list
     * @param {Object} result - Calculation result from SLAMath.calculatePenalty
     * @param {number} contractValue - Contract value
     * @returns {Array} - Array of explanation items
     */
    static createExplanationList(result, contractValue) {
        const { tier, shortfall, appliedPercentage, actualUptime, promisedUptime } = result;
        
        const items = [
            `Promised uptime: ${this.formatPercentage(promisedUptime)}`,
            `Actual uptime: ${this.formatPercentage(actualUptime)}`,
            `Shortfall: ${this.formatPercentage(shortfall)}`
        ];
        
        if (tier === "No penalty") {
            items.push(`Reason: Met or exceeded SLA. No penalty applies.`);
        } else {
            items.push(`Reason: ${this.createExplanation(result, contractValue)}`);
        }
        
        return items;
    }

    /**
     * Format downtime status message
     * @param {number} actualDowntime - Actual downtime in minutes
     * @param {number} allowedDowntime - Allowed downtime in minutes
     * @returns {string} - Status message
     */
    static formatDowntimeStatus(actualDowntime, allowedDowntime) {
        const difference = actualDowntime - allowedDowntime;
        
        if (difference <= 0) {
            return `Within allowance by ${this.formatMinutes(Math.abs(difference))} min`;
        } else {
            return `Exceeded allowance by ${this.formatMinutes(difference)} min`;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormatUtils;
}
