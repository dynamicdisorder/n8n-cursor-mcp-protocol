/**
 * Shareable calculator scenarios via URL query params (no backend).
 * Example: ?cv=1000000&up=99.95&dt=90&pd=30&cur=USD
 */
const ScenarioUrl = {
    /**
     * @param {Record<string, string>} keyToElementId - queryKey -> input element id
     * @returns {Record<string, string>} values that were applied
     */
    applyFromLocation(keyToElementId) {
        const params = new URLSearchParams(window.location.search);
        const applied = {};
        Object.keys(keyToElementId).forEach((key) => {
            if (!params.has(key)) return;
            const el = document.getElementById(keyToElementId[key]);
            if (!el) return;
            const value = params.get(key);
            if (value === null || value === '') return;
            el.value = value;
            applied[key] = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        return applied;
    },

    /**
     * Write current form values into the address bar (replaceState).
     * @param {Record<string, string>} keyToElementId
     * @param {{ clearHash?: boolean }} [opts]
     */
    writeFromForm(keyToElementId, opts = {}) {
        const params = new URLSearchParams();
        Object.keys(keyToElementId).forEach((key) => {
            const el = document.getElementById(keyToElementId[key]);
            if (!el || el.value === '' || el.value === null || el.value === undefined) return;
            params.set(key, String(el.value));
        });
        const qs = params.toString();
        const hash = opts.clearHash ? '' : window.location.hash;
        const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${hash}`;
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', next);
        }
    },

    /**
     * Full shareable URL for the current form state.
     * @param {Record<string, string>} keyToElementId
     */
    buildShareUrl(keyToElementId) {
        this.writeFromForm(keyToElementId, { clearHash: true });
        return window.location.href.split('#')[0];
    },

    /**
     * Copy share URL to clipboard; returns a Promise<boolean>.
     */
    async copyShareUrl(keyToElementId) {
        const url = this.buildShareUrl(keyToElementId);
        try {
            await navigator.clipboard.writeText(url);
            return true;
        } catch (e) {
            try {
                const ta = document.createElement('textarea');
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                return true;
            } catch (e2) {
                return false;
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.ScenarioUrl = ScenarioUrl;
}
