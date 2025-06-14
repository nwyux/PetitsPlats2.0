export class SearchManager {
    constructor() {
        this.searchInput = null;
        this.currentQuery = '';
        this.minSearchLength = 3;
    }

    /**
     * Initialise la fonctionnalité de recherche
     */
    init() {
        this.searchInput = document.querySelector('input[type="text"]');
        if (!this.searchInput) return;

        this.setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements pour la recherche
     */
    setupEventListeners() {
        // Recherche en temps réel avec debounce
        let debounceTimer;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Recherche au clic sur le bouton
        const searchButton = document.querySelector('button[class*="absolute"]');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.handleSearch(this.searchInput.value);
            });
        }

        // Recherche avec la touche Entrée
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch(e.target.value);
            }
        });
    }

    /**
     * Gère la logique de recherche
     * @param {string} query - Terme de recherche
     */
    handleSearch(query) {
        const trimmedQuery = query.trim();
        
        // Ne lance la recherche que si le terme fait au moins 3 caractères
        if (trimmedQuery.length >= this.minSearchLength || trimmedQuery.length === 0) {
            this.currentQuery = trimmedQuery;
            
            // Dispatch un événement pour informer les autres composants
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
        }
    }
}