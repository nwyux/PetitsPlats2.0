import { renderRecipes } from "../templates/recipes.js";
import { recipes } from "../../data/recipes.js";
import { DropdownManager } from "../components/dropdown.js";
import { SearchManager } from "../components/search.js";
import { TagManager } from "../components/tagManager.js";
import { RecipeCounter } from "../components/recipeCounter.js";
import { applyAllFilters } from "../utils/filters.js";

class App {
    constructor() {
        this.originalRecipes = recipes;
        this.filteredRecipes = recipes;
        
        // Initialise les composants
        this.dropdownManager = new DropdownManager();
        this.searchManager = new SearchManager();
        this.tagManager = new TagManager();
        this.recipeCounter = new RecipeCounter();
        
        this.recipesContainer = null;
    }

    /**
     * Initialise l'application
     */
    init() {
        this.recipesContainer = document.querySelector('.recipes-section');
        
        // Initialise tous les composants
        this.dropdownManager.init(this.originalRecipes);
        this.searchManager.init();
        this.tagManager.init();
        this.recipeCounter.init();
        
        // Configure les écouteurs d'événements
        this.setupEventListeners();
        
        // Affichage initial
        this.renderFilteredRecipes();
    }

    /**
     * Configure les écouteurs d'événements globaux
     */
    setupEventListeners() {
        // Écoute les changements de recherche
        document.addEventListener('searchPerformed', (e) => {
            this.handleFiltersChange();
        });

        // Écoute les changements de tags
        document.addEventListener('filtersChanged', (e) => {
            this.handleFiltersChange();
        });
    }

    /**
     * Gère les changements de filtres
     */
    handleFiltersChange() {
        const searchQuery = this.searchManager.getCurrentQuery();
        const selectedTags = this.tagManager.getSelectedTags();
        
        // Applique tous les filtres
        this.filteredRecipes = applyAllFilters(
            this.originalRecipes,
            searchQuery,
            selectedTags
        );
        
        // Met à jour l'affichage
        this.renderFilteredRecipes();
        
        // Met à jour les dropdowns avec les nouvelles données
        this.dropdownManager.updateTags(this.filteredRecipes);
    }

    /**
     * Affiche les recettes filtrées
     */
    renderFilteredRecipes() {
        if (!this.recipesContainer) return;

        if (this.filteredRecipes && this.filteredRecipes.length > 0) {
            renderRecipes(this.filteredRecipes, this.recipesContainer);
            this.recipeCounter.update(this.filteredRecipes.length);
        } else {
            this.recipesContainer.innerHTML = `
                <div class="max-w-7xl mx-auto px-8 py-8">
                    <p class="text-center text-gray-500 py-8">
                        Aucune recette ne correspond à vos critères. 
                        <br>
                        Vous pouvez chercher « tarte aux pommes », « poisson », etc.
                    </p>
                </div>
            `;
            this.recipeCounter.update(0);
        }
    }
}

// Démarre l'application
document.addEventListener('DOMContentLoaded', () => {
    new App().init();
});