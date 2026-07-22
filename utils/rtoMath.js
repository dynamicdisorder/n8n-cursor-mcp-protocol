// RTO/RPO Impact Calculation Utilities
class RTOMath {
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
     * Calculate annualized loss based on RTO and incident frequency
     * @param {number} rtoHours - Recovery Time Objective in hours
     * @param {number} incidentFrequency - Number of incidents per year
     * @param {number} revenuePerHour - Revenue per hour
     * @returns {number} - Annualized loss amount
     */
    static calculateAnnualizedLoss(rtoHours, incidentFrequency, revenuePerHour) {
        return rtoHours * incidentFrequency * revenuePerHour;
    }

    /**
     * Calculate RPO cost when data recreation cost is provided
     * @param {number} rpoHours - Recovery Point Objective in hours
     * @param {number} incidentFrequency - Number of incidents per year
     * @param {number} dataRecreationCostPerHour - Cost to recreate data per hour
     * @returns {number} - Annual RPO cost
     */
    static calculateRPOCost(rpoHours, incidentFrequency, dataRecreationCostPerHour) {
        if (!dataRecreationCostPerHour || dataRecreationCostPerHour <= 0) {
            return 0;
        }
        return rpoHours * incidentFrequency * dataRecreationCostPerHour;
    }

    /**
     * Calculate total annualized impact including RTO and RPO costs
     * @param {Object} params - Calculation parameters
     * @param {number} params.rtoHours - RTO in hours
     * @param {number} params.rpoHours - RPO in hours
     * @param {number} params.incidentFrequency - Incidents per year
     * @param {number} params.revenuePerHour - Revenue per hour
     * @param {number} params.dataRecreationCostPerHour - Data recreation cost per hour
     * @returns {Object} - Detailed impact breakdown
     */
    static calculateRTOImpact(params) {
        const {
            rtoHours,
            rpoHours,
            incidentFrequency,
            revenuePerHour,
            dataRecreationCostPerHour
        } = params;

        // Calculate RTO-based revenue loss
        const rtoLoss = this.calculateAnnualizedLoss(rtoHours, incidentFrequency, revenuePerHour);
        
        // Calculate RPO-based data recreation costs
        const rpoCost = this.calculateRPOCost(rpoHours, incidentFrequency, dataRecreationCostPerHour);
        
        // Calculate total impact
        const totalImpact = rtoLoss + rpoCost;

        return {
            rtoLoss,
            rpoCost,
            totalImpact,
            rtoHours,
            rpoHours,
            incidentFrequency
        };
    }

    /**
     * Assess risk level based on RTO and RPO targets
     * @param {number} rtoHours - RTO in hours
     * @param {number} rpoHours - RPO in hours
     * @returns {Object} - Risk assessment with level and description
     */
    static assessRiskLevel(rtoHours, rpoHours) {
        let riskLevel = 'Low';
        let riskScore = 0;
        let description = '';

        // RTO Risk Assessment (>4h RTO = High risk)
        if (rtoHours <= 1) {
            riskScore += 1; // Low RTO risk
        } else if (rtoHours <= 4) {
            riskScore += 2; // Medium RTO risk
        } else {
            riskScore += 3; // High RTO risk
        }

        // RPO Risk Assessment
        if (rpoHours <= 0.25) { // 15 minutes
            riskScore += 1; // Low RPO risk
        } else if (rpoHours <= 1) { // 1 hour
            riskScore += 2; // Medium RPO risk
        } else if (rpoHours <= 4) { // 4 hours
            riskScore += 3; // Medium-High RPO risk
        } else {
            riskScore += 4; // High RPO risk
        }

        // Determine overall risk level
        if (riskScore <= 2) {
            riskLevel = 'Low';
            description = 'Excellent disaster recovery targets. Your business is well-protected.';
        } else if (riskScore <= 4) {
            riskLevel = 'Medium';
            description = 'Good disaster recovery targets with room for improvement.';
        } else {
            riskLevel = 'High';
            description = 'Significant risk exposure. Consider improving your disaster recovery targets.';
        }

        return {
            level: riskLevel,
            score: riskScore,
            description,
            rtoRisk: rtoHours > 4 ? 'High' : rtoHours > 1 ? 'Medium' : 'Low',
            rpoRisk: rpoHours > 4 ? 'High' : rpoHours > 1 ? 'Medium' : 'Low'
        };
    }

    /**
     * Generate recommendations based on RTO/RPO targets and risk assessment
     * @param {Object} params - Parameters including RTO, RPO, and risk assessment
     * @returns {Array} - Array of recommendation strings
     */
    static generateRecommendations(params) {
        const { rtoHours, rpoHours, riskAssessment } = params;
        const recommendations = [];

        // RTO-based recommendations
        if (rtoHours > 4) {
            recommendations.push('Consider implementing automated failover systems to reduce RTO to under 4 hours.');
            recommendations.push('Invest in redundant infrastructure and hot standby systems.');
        } else if (rtoHours > 1) {
            recommendations.push('Optimize your recovery procedures to achieve RTO under 1 hour for critical systems.');
        }

        // RPO-based recommendations
        if (rpoHours > 4) {
            recommendations.push('Implement real-time data replication to reduce RPO to under 4 hours.');
            recommendations.push('Consider continuous backup solutions to minimize data loss.');
        } else if (rpoHours > 1) {
            recommendations.push('Improve backup frequency to achieve RPO under 1 hour.');
            recommendations.push('Implement incremental backups to reduce data loss window.');
        } else if (rpoHours > 0.25) {
            recommendations.push('Consider synchronous replication for critical data to achieve RPO under 15 minutes.');
        }

        // General recommendations based on risk level
        if (riskAssessment.level === 'High') {
            recommendations.push('Prioritize disaster recovery improvements to reduce business risk.');
            recommendations.push('Conduct regular disaster recovery testing and training.');
            recommendations.push('Consider engaging disaster recovery specialists for assessment.');
        } else if (riskAssessment.level === 'Medium') {
            recommendations.push('Regularly review and test your disaster recovery procedures.');
            recommendations.push('Monitor and optimize your current disaster recovery capabilities.');
        } else {
            recommendations.push('Maintain your excellent disaster recovery posture with regular testing.');
            recommendations.push('Consider extending your disaster recovery capabilities to other systems.');
        }

        // Cost-benefit recommendations
        if (params.totalImpact > 100000) {
            recommendations.push('High financial impact suggests investing in improved disaster recovery is cost-justified.');
        }

        return recommendations;
    }

    /**
     * Get industry standard benchmarks for RTO/RPO
     * @returns {Object} - Industry standard values
     */
    static getIndustryStandards() {
        return {
            critical: {
                rto: 1, // 1 hour
                rpo: 0.25 // 15 minutes
            },
            important: {
                rto: 4, // 4 hours
                rpo: 1 // 1 hour
            },
            standard: {
                rto: 24, // 24 hours
                rpo: 4 // 4 hours
            }
        };
    }

    /**
     * Calculate comparison percentages for visualization
     * @param {number} target - Target value
     * @param {Object} standards - Industry standards
     * @returns {Object} - Comparison data
     */
    static calculateComparison(target, standards) {
        const criticalPercent = Math.min((target / standards.critical) * 100, 100);
        const importantPercent = Math.min((target / standards.important) * 100, 100);
        const standardPercent = Math.min((target / standards.standard) * 100, 100);

        return {
            critical: criticalPercent,
            important: importantPercent,
            standard: standardPercent,
            riskLevel: target <= standards.critical ? 'Low' : 
                      target <= standards.important ? 'Medium' : 'High'
        };
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
            rtoHours,
            rpoHours,
            incidentFrequency,
            revenuePerHour,
            dataRecreationCostPerHour
        } = params;

        // Required fields
        if (!rtoHours || rtoHours <= 0) {
            errors.push("RTO must be greater than 0 hours");
        }

        if (!rpoHours || rpoHours <= 0) {
            errors.push("RPO must be greater than 0 hours");
        }

        if (!incidentFrequency || incidentFrequency <= 0) {
            errors.push("Incident frequency must be greater than 0");
        }

        if (!revenuePerHour || revenuePerHour <= 0) {
            errors.push("Revenue per hour must be greater than 0");
        }

        // Warning for very high values
        if (rtoHours > 168) { // More than a week
            warnings.push("RTO exceeds 1 week - consider if this is realistic for business continuity");
        }

        if (rpoHours > 168) { // More than a week
            warnings.push("RPO exceeds 1 week - consider if this is acceptable for data loss");
        }

        if (incidentFrequency > 365) { // More than daily
            warnings.push("Incident frequency exceeds daily - consider if this is realistic");
        }

        // Optional field validation
        if (dataRecreationCostPerHour < 0) {
            errors.push("Data recreation cost cannot be negative");
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
        if (hours < 1) {
            const minutes = Math.round(hours * 60);
            return `${minutes}m`;
        } else if (hours < 24) {
            const wholeHours = Math.floor(hours);
            const minutes = Math.round((hours - wholeHours) * 60);
            if (minutes === 0) {
                return `${wholeHours}h`;
            } else {
                return `${wholeHours}h ${minutes}m`;
            }
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            if (remainingHours === 0) {
                return `${days}d`;
            } else {
                return `${days}d ${remainingHours}h`;
            }
        }
    }

    /**
     * Calculate cost per incident
     * @param {number} totalCost - Total annual cost
     * @param {number} incidentFrequency - Number of incidents per year
     * @returns {number} - Cost per incident
     */
    static calculateCostPerIncident(totalCost, incidentFrequency) {
        return incidentFrequency > 0 ? totalCost / incidentFrequency : 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RTOMath;
}
