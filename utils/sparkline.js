// Sparkline Chart Utility for Downtime Cost Visualization
class Sparkline {
    /**
     * Draw a sparkline chart on canvas
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Array} data - Array of numeric values
     * @param {Object} options - Chart options
     */
    static draw(canvas, data, options = {}) {
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const {
            width = canvas.width,
            height = canvas.height,
            color = '#3b82f6',
            strokeWidth = 2,
            fill = true,
            fillColor = 'rgba(59, 130, 246, 0.1)',
            showPoints = false,
            pointColor = '#3b82f6',
            pointSize = 3
        } = options;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Normalize data to fit canvas
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const range = maxValue - minValue || 1; // Avoid division by zero

        const normalizedData = data.map(value => 
            height - ((value - minValue) / range) * (height - 10) - 5
        );

        // Draw the line
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(0, normalizedData[0]);
        
        for (let i = 1; i < normalizedData.length; i++) {
            const x = (i / (normalizedData.length - 1)) * width;
            ctx.lineTo(x, normalizedData[i]);
        }
        
        ctx.stroke();

        // Fill area under the line if requested
        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.lineTo(width, height - 5);
            ctx.lineTo(0, height - 5);
            ctx.closePath();
            ctx.fill();
        }

        // Draw points if requested
        if (showPoints) {
            ctx.fillStyle = pointColor;
            for (let i = 0; i < normalizedData.length; i++) {
                const x = (i / (normalizedData.length - 1)) * width;
                ctx.beginPath();
                ctx.arc(x, normalizedData[i], pointSize, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    /**
     * Draw a cumulative loss sparkline
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {number} totalLoss - Total loss amount
     * @param {number} durationHours - Duration in hours
     * @param {string} currency - Currency symbol
     */
    static drawCumulativeLoss(canvas, totalLoss, durationHours, currency = '$') {
        if (!canvas || totalLoss <= 0) return;

        // Generate data points showing cumulative loss over time
        const dataPoints = 30; // Number of points in the sparkline
        const data = [];
        
        for (let i = 0; i <= dataPoints; i++) {
            // Simulate cumulative loss building up over time
            const progress = i / dataPoints;
            const loss = totalLoss * progress;
            data.push(loss);
        }

        // Draw with custom styling for downtime cost
        this.draw(canvas, data, {
            color: '#ef4444', // Red color for loss
            fill: true,
            fillColor: 'rgba(239, 68, 68, 0.1)',
            strokeWidth: 2,
            showPoints: false
        });

        // Add subtle gradient effect
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');
        
        // Redraw with gradient
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const range = maxValue - minValue || 1;
        const normalizedData = data.map(value => 
            canvas.height - ((value - minValue) / range) * (canvas.height - 10) - 5
        );

        ctx.beginPath();
        ctx.moveTo(0, normalizedData[0]);
        
        for (let i = 1; i < normalizedData.length; i++) {
            const x = (i / (normalizedData.length - 1)) * canvas.width;
            ctx.lineTo(x, normalizedData[i]);
        }
        
        ctx.stroke();
    }

    /**
     * Draw a simple line chart
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Array} data - Array of numeric values
     * @param {Object} options - Chart options
     */
    static drawLine(canvas, data, options = {}) {
        this.draw(canvas, data, {
            fill: false,
            showPoints: false,
            ...options
        });
    }

    /**
     * Draw a filled area chart
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Array} data - Array of numeric values
     * @param {Object} options - Chart options
     */
    static drawArea(canvas, data, options = {}) {
        this.draw(canvas, data, {
            fill: true,
            showPoints: false,
            ...options
        });
    }

    /**
     * Draw a chart with data points
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Array} data - Array of numeric values
     * @param {Object} options - Chart options
     */
    static drawWithPoints(canvas, data, options = {}) {
        this.draw(canvas, data, {
            fill: false,
            showPoints: true,
            ...options
        });
    }

    /**
     * Create a responsive sparkline that redraws on window resize
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Array} data - Array of numeric values
     * @param {Object} options - Chart options
     */
    static createResponsive(canvas, data, options = {}) {
        const drawChart = () => {
            // Set canvas size to match display size
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            this.draw(canvas, data, options);
        };

        // Initial draw
        drawChart();

        // Redraw on resize
        window.addEventListener('resize', drawChart);

        // Return cleanup function
        return () => {
            window.removeEventListener('resize', drawChart);
        };
    }

    /**
     * Animate sparkline drawing
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Array} data - Array of numeric values
     * @param {Object} options - Chart options
     * @param {number} duration - Animation duration in ms
     */
    static animate(canvas, data, options = {}, duration = 1000) {
        if (!canvas || !data || data.length === 0) return;

        const startTime = performance.now();
        const ctx = canvas.getContext('2d');
        const {
            width = canvas.width,
            height = canvas.height,
            color = '#3b82f6',
            strokeWidth = 2
        } = options;

        const animateFrame = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Calculate how many points to draw based on animation progress
            const pointsToDraw = Math.floor(data.length * progress);
            const animatedData = data.slice(0, pointsToDraw + 1);
            
            if (animatedData.length > 1) {
                // Normalize data
                const minValue = Math.min(...data);
                const maxValue = Math.max(...data);
                const range = maxValue - minValue || 1;
                
                const normalizedData = animatedData.map(value => 
                    height - ((value - minValue) / range) * (height - 10) - 5
                );
                
                // Draw the animated line
                ctx.strokeStyle = color;
                ctx.lineWidth = strokeWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                ctx.beginPath();
                ctx.moveTo(0, normalizedData[0]);
                
                for (let i = 1; i < normalizedData.length; i++) {
                    const x = (i / (data.length - 1)) * width;
                    ctx.lineTo(x, normalizedData[i]);
                }
                
                ctx.stroke();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateFrame);
            }
        };
        
        requestAnimationFrame(animateFrame);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sparkline;
}
