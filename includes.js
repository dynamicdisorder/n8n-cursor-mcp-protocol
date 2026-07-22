/**
 * TechImpact.online - Include System
 * Loads header and footer partials dynamically
 * Compatible with Vercel static hosting
 */

class IncludeSystem {
    constructor() {
        this.partials = new Map();
        this.loadPromises = new Map();
    }

    /**
     * Load a partial HTML file
     * @param {string} path - Path to the partial file
     * @returns {Promise<string>} - HTML content
     */
    async loadPartial(path) {
        // Return cached content if available
        if (this.partials.has(path)) {
            return this.partials.get(path);
        }

        // Return existing promise if already loading
        if (this.loadPromises.has(path)) {
            return this.loadPromises.get(path);
        }

        // Create new load promise
        const loadPromise = this.fetchPartial(path);
        this.loadPromises.set(path, loadPromise);

        try {
            const content = await loadPromise;
            this.partials.set(path, content);
            this.loadPromises.delete(path);
            return content;
        } catch (error) {
            this.loadPromises.delete(path);
            console.error(`Failed to load partial: ${path}`, error);
            return this.getFallbackContent(path);
        }
    }

    /**
     * Fetch partial content from server
     * @param {string} path - Path to the partial file
     * @returns {Promise<string>} - HTML content
     */
    async fetchPartial(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    }

    /**
     * Get fallback content for development
     * @param {string} path - Path to the partial file
     * @returns {string} - Fallback HTML content
     */
    getFallbackContent(path) {
        if (path.includes('header')) {
            return `
                <header class="header">
                    <div class="container">
                        <div class="header-content">
                            <div class="logo">
                                <a href="/index.html" class="logo-link">
                                    <span class="logo-icon">📊</span>
                                    <span class="logo-text">TechImpact.online</span>
                                </a>
                            </div>
                            <nav class="nav">
                                <a href="/product.html" class="nav-link">Product</a>
                                <a href="/reliability-money-toolkit.html" class="nav-link">Toolkit</a>
                                <a href="/guides.html" class="nav-link">Guides</a>
                                <a href="/about.html" class="nav-link">About</a>
                                <a href="/contact.html" class="nav-link">Contact</a>
                            </nav>
                            <div class="header-actions">
                                <a href="/start-trial.html" class="cta-btn primary">Get Started</a>
                            </div>
                        </div>
                    </div>
                </header>
            `;
        }
        
        if (path.includes('footer')) {
            return `
                <footer class="footer">
                    <div class="container">
                        <div class="footer-content">
                            <div class="footer-section">
                                <h4 class="footer-title">TechImpact.online</h4>
                                <p class="footer-description">Advanced calculators and professional reporting tools for modern teams.</p>
                            </div>
                            <div class="footer-section">
                                <h5 class="footer-subtitle">Calculators</h5>
                                <ul class="footer-links">
                                    <li><a href="index.html" class="footer-link">SLA Penalty Calculator</a></li>
                                    <li><a href="website-downtime-cost-calculator.html" class="footer-link">Downtime Cost Calculator</a></li>
                                    <li><a href="rto-rpo-impact-calculator.html" class="footer-link">RTO/RPO Impact Calculator</a></li>
                                    <li><a href="allowed-downtime-calculator.html" class="footer-link">Allowed Downtime</a></li>
                                    <li><a href="nines-availability-cost-calculator.html" class="footer-link">Cost of Nines</a></li>
                                </ul>
                            </div>
                            <div class="footer-section">
                                <h5 class="footer-subtitle">Resources</h5>
                                <ul class="footer-links">
                                    <li><a href="reliability-money-toolkit.html" class="footer-link">Reliability Money Toolkit</a></li>
                                    <li><a href="guides/recent-outages-cost-brief.html" class="footer-link">Recent outages brief</a></li>
                                    <li><a href="guides.html" class="footer-link">Guides</a></li>
                                    <li><a href="resources.html" class="footer-link">Resources</a></li>
                                    <li><a href="start-trial.html" class="footer-link">Start Free Trial</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer-bottom">
                            <div class="footer-legal">
                                <p class="legal-disclaimer">All calculations are estimates. Pro features coming soon. Use at your own discretion.</p>
                                <p class="footer-copyright">&copy; <span id="current-year">${new Date().getFullYear()}</span> TechImpact.online. All rights reserved.</p>
                                <p class="footer-built-with">Built with love by <a href="https://dynamicdisorder.co" target="_blank" rel="noopener" class="footer-link">DynamicDisorder.co</a></p>
                            </div>
                        </div>
                    </div>
                </footer>
                <div class="disclaimer">
                    <p>Estimates only. Check your contract.</p>
                </div>
            `;
        }

        return `<div class="partial-error">Failed to load: ${path}</div>`;
    }

    /**
     * Include a partial into an element
     * @param {string} selector - CSS selector for the target element
     * @param {string} partialPath - Path to the partial file
     */
    async include(selector, partialPath) {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`Element not found: ${selector}`);
            return;
        }

        try {
            const content = await this.loadPartial(partialPath);
            element.innerHTML = content;
        } catch (error) {
            console.error(`Failed to include ${partialPath} into ${selector}:`, error);
            element.innerHTML = this.getFallbackContent(partialPath);
        }
    }

    /**
     * Initialize includes for common elements
     */
    async init() {
        // Load header if element exists
        if (document.querySelector('#header-placeholder')) {
            await this.include('#header-placeholder', '/partials/header.html');
        }

        // Load footer if element exists
        if (document.querySelector('#footer-placeholder')) {
            await this.include('#footer-placeholder', '/partials/footer.html');
        }

        // Set active navigation link based on current page
        this.setActiveNavLink();

        // Set current year in footer
        this.setCurrentYear();

        // Trigger any existing page scripts that might depend on the loaded content
        this.triggerPageScripts();
    }

    /**
     * Set current year in footer
     */
    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Trigger page-specific scripts after includes are loaded
     */
    triggerPageScripts() {
        // Dispatch a custom event to signal that includes are loaded
        window.dispatchEvent(new CustomEvent('includesLoaded'));

        // Re-run any initialization scripts that might be on the page
        if (typeof window.initPage === 'function') {
            window.initPage();
        }
    }

    /**
     * Set active navigation link based on current page
     */
    setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Check if current page matches the link
            if (currentPath.includes(href) || 
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize include system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.includeSystem = new IncludeSystem();
    window.includeSystem.init();
});

// Export for manual use
window.IncludeSystem = IncludeSystem;
