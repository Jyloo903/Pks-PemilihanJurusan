// frontend/js/api.js - UPDATE INI!
const API = {
    // GANTI INI SAJA!
    baseURL: window.CONFIG ? window.CONFIG.API_BASE : 'https://ahp-jurusan-backend-production.up.railway.app/api',
    
    // Generic fetch with auth
    async fetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };
        
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...defaultOptions,
                ...options
            });
            
            // Handle unauthorized
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = 'login.html';
                return { error: 'Unauthorized' };
            }
            
            return response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { error: error.message };
        }
    },
    
    // Get criteria
    async getCriteria() {
        return this.fetch('/criteria');
    },
    
    // Get alternatives (majors)
    async getAlternatives() {
        return this.fetch('/alternatives');
    },
    
    // Save pairwise comparisons
    async savePairwise(comparisons) {
        return this.fetch('/pairwise', {
            method: 'POST',
            body: JSON.stringify({ comparisons })
        });
    },
    
    // Save preferences
    async savePreferences(preferences) {
        return this.fetch('/preferences', {
            method: 'POST',
            body: JSON.stringify({ preferences })
        });
    },
    
    // Calculate AHP
    async calculateAHP() {
        return this.fetch('/ahp/calculate', {
            method: 'POST'
        });
    },
    
    // Get universities for alternative
    async getUniversitiesForAlternative(alternativeId) {
        return this.fetch(`/universities/for-alternative/${alternativeId}`);
    },
    
    // Admin functions
    async getUsers() {
        return this.fetch('/admin/users');
    },
    
    async getStats() {
        return this.fetch('/admin/stats');
    },
    
    async getUniversities() {
        return this.fetch('/universities');
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.API = API;
    
    // Debug info
    console.log('🎯 API Loaded. Base URL:', API.baseURL);
    
    // Auto test
    API.fetch('/health')
        .then(data => console.log('🏥 Backend Health:', data))
        .catch(err => console.error('💀 Backend Error:', err));
}