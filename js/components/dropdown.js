import { getAllTags, filterTags } from "../utils/getTags.js";

export class DropdownManager {
    constructor() {
        this.activeDropdown = null;
        this.dropdowns = [
            { selector: '.tags-ingredients', type: 'ingredients' },
            { selector: '.tags-appareils', type: 'appliances' },
            { selector: '.tags-ustensiles', type: 'ustensils' }
        ];
        this.allTagsCache = {}; // Cache pour stocker tous les tags
    }

    /**
     * Initialise tous les dropdowns
     * @param {Array} recipes - Tableau des recettes
     */
    init(recipes) {
        const allTags = getAllTags(recipes);
        this.allTagsCache = allTags;
        
        this.dropdowns.forEach(dropdown => {
            this.createDropdownStructure(dropdown.selector);
            this.injectTags(dropdown.selector, allTags[dropdown.type]);
            this.setupToggle(dropdown.selector);
            this.setupSearch(dropdown.selector, dropdown.type);
        });
    }

    /**
     * Crée la structure HTML du dropdown avec barre de recherche
     * @param {string} dropdownSelector - Sélecteur CSS du dropdown
     */
    createDropdownStructure(dropdownSelector) {
        const dropdown = document.querySelector(dropdownSelector);
        if (!dropdown) return;

        const dropdownMenu = dropdown.querySelector('div[class*="absolute"]');
        if (!dropdownMenu) return;

        dropdownMenu.innerHTML = `
            <div class="p-2">
                <div class="relative">
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded focus:outline-none text-sm"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <ul class="py-2 max-h-60 overflow-y-auto">
                <!-- Les tags sont injectés ici -->
            </ul>
        `;
    }

    /**
     * Configure la recherche dans un dropdown
     * @param {string} dropdownSelector - Sélecteur CSS du dropdown
     * @param {string} tagType - Type de tags (ingredients, appliances, ustensils)
     */
    setupSearch(dropdownSelector, tagType) {
        const dropdown = document.querySelector(dropdownSelector);
        if (!dropdown) return;

        const searchInput = dropdown.querySelector('input[type="text"]');
        if (!searchInput) return;

        // Écoute les changements dans la barre de recherche
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            const originalTags = this.allTagsCache[tagType] || [];
            const filteredTags = filterTags(originalTags, searchTerm);
            
            this.injectTags(dropdownSelector, filteredTags);
        });

        searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const button = dropdown.querySelector('button');
        button.addEventListener('click', () => {
            setTimeout(() => {
                if (!dropdown.querySelector('div[class*="absolute"]').classList.contains('hidden')) {
                    searchInput.focus();
                }
            }, 100);
        });
    }

    /**
     * Injecte les tags dans un dropdown spécifique
     * @param {string} dropdownSelector - Sélecteur CSS du dropdown
     * @param {Array} tags - Tableau des tags à injecter
     */
    injectTags(dropdownSelector, tags) {
        const dropdown = document.querySelector(dropdownSelector);
        if (!dropdown) return;

        const ul = dropdown.querySelector('ul');
        if (!ul) return;

        ul.innerHTML = '';

        if (tags.length === 0) {
            const li = document.createElement('li');
            li.className = 'px-4 py-2 text-gray-500 italic';
            li.textContent = 'Aucun résultat trouvé';
            ul.appendChild(li);
            return;
        }

        tags.forEach(tag => {
            const li = document.createElement('li');
            li.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors';
            li.textContent = tag;
            li.setAttribute('data-tag', tag);
            
            li.addEventListener('click', () => {
                this.handleTagSelection(tag, dropdownSelector);
            });

            ul.appendChild(li);
        });
    }

    /**
     * Configure le comportement d'ouverture/fermeture d'un dropdown
     * @param {string} dropdownSelector - Sélecteur CSS du dropdown
     */
    setupToggle(dropdownSelector) {
        const dropdown = document.querySelector(dropdownSelector);
        if (!dropdown) return;

        const button = dropdown.querySelector('button');
        const dropdownMenu = dropdown.querySelector('div[class*="absolute"]');

        if (!button || !dropdownMenu) return;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(dropdown, dropdownMenu);
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
                this.activeDropdown = null;
                this.resetSearch(dropdownSelector);
            }
        });
    }

    /**
     * Remet à zéro la recherche d'un dropdown
     * @param {string} dropdownSelector - Sélecteur CSS du dropdown
     */
    resetSearch(dropdownSelector) {
        const dropdown = document.querySelector(dropdownSelector);
        if (!dropdown) return;

        const searchInput = dropdown.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.value = '';
        }

        const dropdownType = this.dropdowns.find(d => d.selector === dropdownSelector)?.type;
        if (dropdownType && this.allTagsCache[dropdownType]) {
            this.injectTags(dropdownSelector, this.allTagsCache[dropdownType]);
        }
    }

    /**
     * Toggle l'état d'un dropdown
     * @param {Element} dropdown - Element du dropdown
     * @param {Element} dropdownMenu - Menu du dropdown
     */
    toggleDropdown(dropdown, dropdownMenu) {
        this.dropdowns.forEach(({ selector }) => {
            const otherDropdown = document.querySelector(selector);
            if (otherDropdown !== dropdown) {
                const otherMenu = otherDropdown.querySelector('div[class*="absolute"]');
                if (otherMenu) {
                    otherMenu.classList.add('hidden');
                    this.resetSearch(selector);
                }
            }
        });

        dropdownMenu.classList.toggle('hidden');
        this.activeDropdown = dropdownMenu.classList.contains('hidden') ? null : dropdown;
        
        if (dropdownMenu.classList.contains('hidden')) {
            const dropdownSelector = this.dropdowns.find(d => 
                document.querySelector(d.selector) === dropdown
            )?.selector;
            if (dropdownSelector) {
                this.resetSearch(dropdownSelector);
            }
        }
    }

    /**
     * Gère la sélection d'un tag
     * @param {string} tag - Tag sélectionné
     * @param {string} dropdownSelector - Sélecteur du dropdown
     */
    handleTagSelection(tag, dropdownSelector) {
        console.log(`Tag sélectionné: ${tag} depuis ${dropdownSelector}`);
        
        // Dispatch un événement personnalisé pour informer les autres composants
        document.dispatchEvent(new CustomEvent('tagSelected', {
            detail: { tag, dropdownSelector }
        }));
        
        const dropdown = document.querySelector(dropdownSelector);
        const dropdownMenu = dropdown.querySelector('div[class*="absolute"]');
        if (dropdownMenu) {
            dropdownMenu.classList.add('hidden');
            this.resetSearch(dropdownSelector);
        }
    }

    /**
     * Met à jour les tags dans les dropdowns
     * @param {Array} recipes - Nouvelles recettes filtrées
     */
    updateTags(recipes) {
        const allTags = getAllTags(recipes);
        this.allTagsCache = allTags;
        
        this.dropdowns.forEach(dropdown => {
            const dropdownElement = document.querySelector(dropdown.selector);
            const dropdownMenu = dropdownElement?.querySelector('div[class*="absolute"]');
            const searchInput = dropdownElement?.querySelector('input[type="text"]');
            
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden') && searchInput?.value) {
                // Si une recherche est en cours, applique le filtre
                const filteredTags = filterTags(allTags[dropdown.type], searchInput.value);
                this.injectTags(dropdown.selector, filteredTags);
            } else {
                // Sinon, affiche tous les tags
                this.injectTags(dropdown.selector, allTags[dropdown.type]);
            }
        });
    }
}