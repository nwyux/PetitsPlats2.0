export class SearchManager {
    constructor() {
        this.searchInput = null;
        this.currentQuery = '';
        this.minSearchLength = 3;
        this.clearButton = null;
    }

    /**
     * Initialise la fonctionnalité de recherche
     */
    init() {
        this.searchInput = document.querySelector('input[type="text"]');
        if (!this.searchInput) return;

        this.createClearButton();
        this.setupEventListeners();
    }

    /**
     * Crée le bouton de suppression (croix)
     */
    createClearButton() {
        const searchContainer = this.searchInput.parentElement;
        if (!searchContainer || !searchContainer.classList.contains('relative')) return;

        this.clearButton = document.createElement('div');
        this.clearButton.className = 'absolute inset-y-0 right-12 flex items-center pr-2 cursor-pointer hidden';
        this.clearButton.innerHTML = `
            <svg class="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        `;

        searchContainer.appendChild(this.clearButton);

        this.clearButton.addEventListener('click', () => {
            this.reset();
            this.handleSearch('');
        });
    }

    /**
     * Configure les écouteurs d'événements pour la recherche
     */
    setupEventListeners() {
        // Recherche en temps réel avec debounce
        let debounceTimer;
        this.searchInput.addEventListener('input', (e) => {
            this.toggleClearButton(e.target.value);
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        const searchButton = document.querySelector('button[class*="absolute"]');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.handleSearch(this.searchInput.value);
            });
        }

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch(e.target.value);
            }
        });
    }

    /**
     * Affiche ou masque le bouton de suppression selon le contenu de l'input
     * @param {string} value - Valeur actuelle de l'input
     */
    toggleClearButton(value) {
        if (!this.clearButton) return;
        
        if (value.trim().length > 0) {
            this.clearButton.classList.remove('hidden');
        } else {
            this.clearButton.classList.add('hidden');
        }
    }

    /**
     * Gère la logique de recherche
     * @param {string} query - Terme de recherche
     */
    handleSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length >= this.minSearchLength || trimmedQuery.length === 0) {
            this.currentQuery = trimmedQuery;
            
            document.dispatchEvent(new CustomEvent('searchPerformed', {
                detail: { query: this.currentQuery }
            }));
        }
    }

    /**
     * Retourne la requête actuelle
     * @returns {string} Requête de recherche actuelle
     */
    getCurrentQuery() {
        return this.currentQuery;
    }

    /**
     * Réinitialise la recherche
     */
    reset() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.currentQuery = '';
            this.toggleClearButton('');
        }
    }
}