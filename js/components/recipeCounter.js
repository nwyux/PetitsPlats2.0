export class RecipeCounter {
    constructor() {
        this.counterElement = null;
    }

    /**
     * Initialise le compteur
     */
    init() {
        this.counterElement = document.getElementById('recipes-count');
    }

    /**
     * Met à jour le nombre de recettes affichées
     * @param {number} count - Nombre de recettes
     */
    update(count) {
        if (this.counterElement) {
            this.counterElement.textContent = count;
        }
    }
}