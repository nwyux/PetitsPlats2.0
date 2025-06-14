import { getAllTags } from "../utils/getTags.js";

export class DropdownManager {
    constructor() {
        this.activeDropdown = null;
        this.dropdowns = [
            { selector: '.tags-ingredients', type: 'ingredients' },
            { selector: '.tags-appareils', type: 'appliances' },
            { selector: '.tags-ustensiles', type: 'ustensils' }
        ];
    }

    /**
     * Initialise tous les dropdowns
     * @param {Array} recipes - Tableau des recettes
     */
    init(recipes) {
        const allTags = getAllTags(recipes);
        
        this.dropdowns.forEach(dropdown => {
            this.injectTags(dropdown.selector, allTags[dropdown.type]);
            this.setupToggle(dropdown.selector);
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

        // Vide le contenu existant
        ul.innerHTML = '';

        // Ajoute chaque tag comme élément de liste
        tags.forEach(tag => {
            const li = document.createElement('li');
            li.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors';
            li.textContent = tag;
            li.setAttribute('data-tag', tag);
            
            // Ajoute un gestionnaire de clic
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

        // Toggle dropdown au clic sur le bouton
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(dropdown, dropdownMenu);
        });

        // Ferme le dropdown en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
                this.activeDropdown = null;
            }
        });
    }

    /**
     * Toggle l'état d'un dropdown
     * @param {Element} dropdown - Element du dropdown
     * @param {Element} dropdownMenu - Menu du dropdown
     */
    toggleDropdown(dropdown, dropdownMenu) {
        // Ferme tous les autres dropdowns
        this.dropdowns.forEach(({ selector }) => {
            const otherDropdown = document.querySelector(selector);
            if (otherDropdown !== dropdown) {
                const otherMenu = otherDropdown.querySelector('div[class*="absolute"]');
                if (otherMenu) {
                    otherMenu.classList.add('hidden');
                }
            }
        });

        // Toggle le dropdown actuel
        dropdownMenu.classList.toggle('hidden');
        this.activeDropdown = dropdownMenu.classList.contains('hidden') ? null : dropdown;
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
        
        // Ferme le dropdown après sélection
        const dropdown = document.querySelector(dropdownSelector);
        const dropdownMenu = dropdown.querySelector('div[class*="absolute"]');
        if (dropdownMenu) {
            dropdownMenu.classList.add('hidden');
        }
    }

    /**
     * Met à jour les tags dans les dropdowns
     * @param {Array} recipes - Nouvelles recettes filtrées
     */
    updateTags(recipes) {
        const allTags = getAllTags(recipes);
        
        this.dropdowns.forEach(dropdown => {
            this.injectTags(dropdown.selector, allTags[dropdown.type]);
        });
    }
}