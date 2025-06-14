export class TagManager {
    constructor() {
        this.selectedTags = [];
        this.tagsContainer = null;
    }

    /**
     * Initialise le gestionnaire de tags
     */
    init() {
        this.tagsContainer = document.querySelector('.picked-tags');
        this.setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Écoute les sélections de tags
        document.addEventListener('tagSelected', (e) => {
            this.addTag(e.detail.tag);
        });
    }

    /**
     * Ajoute un tag à la liste des tags sélectionnés
     * @param {string} tag - Tag à ajouter
     */
    addTag(tag) {
        // Évite les doublons
        if (this.selectedTags.includes(tag)) return;

        this.selectedTags.push(tag);
        this.renderTags();
        this.notifyFilterChange();
    }

    /**
     * Retire un tag de la liste des tags sélectionnés
     * @param {string} tag - Tag à retirer
     */
    removeTag(tag) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
        this.renderTags();
        this.notifyFilterChange();
    }

    /**
     * Affiche les tags sélectionnés
     */
    renderTags() {
        if (!this.tagsContainer) return;

        if (this.selectedTags.length === 0) {
            this.tagsContainer.innerHTML = '';
            return;
        }

        const tagsHtml = this.selectedTags.map(tag => `
            <span class="inline-flex items-center bg-custom-yellow text-black px-3 py-2 rounded-full text-sm font-medium">
                ${tag}
                <button 
                    class="ml-2 hover:bg-yellow-600 rounded-full p-1 transition-colors"
                    data-tag="${tag}"
                    aria-label="Retirer le tag ${tag}"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </span>
        `).join('');

        this.tagsContainer.innerHTML = tagsHtml;

        // Ajoute les gestionnaires pour retirer les tags
        this.tagsContainer.querySelectorAll('button[data-tag]').forEach(button => {
            button.addEventListener('click', (e) => {
                const tag = e.target.closest('button').getAttribute('data-tag');
                this.removeTag(tag);
            });
        });
    }

    /**
     * Notifie les autres composants du changement de filtres
     */
    notifyFilterChange() {
        document.dispatchEvent(new CustomEvent('filtersChanged', {
            detail: { selectedTags: [...this.selectedTags] }
        }));
    }

    /**
     * Retourne les tags sélectionnés
     * @returns {Array} Tableau des tags sélectionnés
     */
    getSelectedTags() {
        return [...this.selectedTags];
    }

    /**
     * Vide tous les tags sélectionnés
     */
    clearAll() {
        this.selectedTags = [];
        this.renderTags();
        this.notifyFilterChange();
    }
}