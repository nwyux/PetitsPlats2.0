import { recipes } from '../../data/recipes.js';

/**
 * Extrait tous les ingrédients uniques des recettes
 * @param {Array} recipesData - Tableau des recettes
 * @returns {Array} Tableau des ingrédients triés par ordre alphabétique
 */
export function getIngredients(recipesData = recipes) {
    const ingredients = new Set();
    
    recipesData.forEach(recipe => {
        recipe.ingredients.forEach(item => {
            // Normalise le nom de l'ingrédient (première lettre en majuscule)
            const ingredient = item.ingredient.toLowerCase().trim();
            ingredients.add(ingredient.charAt(0).toUpperCase() + ingredient.slice(1));
        });
    });
    
    return Array.from(ingredients).sort();
}

/**
 * Extrait tous les appareils uniques des recettes
 * @param {Array} recipesData - Tableau des recettes
 * @returns {Array} Tableau des appareils triés par ordre alphabétique
 */
export function getAppliances(recipesData = recipes) {
    const appliances = new Set();
    
    recipesData.forEach(recipe => {
        if (recipe.appliance) {
            // Normalise le nom de l'appareil
            const appliance = recipe.appliance.toLowerCase().trim();
            appliances.add(appliance.charAt(0).toUpperCase() + appliance.slice(1));
        }
    });
    
    return Array.from(appliances).sort();
}

/**
 * Extrait tous les ustensiles uniques des recettes
 * @param {Array} recipesData - Tableau des recettes
 * @returns {Array} Tableau des ustensiles triés par ordre alphabétique
 */
export function getUstensils(recipesData = recipes) {
    const ustensils = new Set();
    
    recipesData.forEach(recipe => {
        if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
            recipe.ustensils.forEach(ustensil => {
                // Normalise le nom de l'ustensile
                const normalizedUstensil = ustensil.toLowerCase().trim();
                ustensils.add(normalizedUstensil.charAt(0).toUpperCase() + normalizedUstensil.slice(1));
            });
        }
    });
    
    return Array.from(ustensils).sort();
}

/**
 * Récupère tous les tags organisés par catégorie
 * @param {Array} recipesData - Tableau des recettes
 * @returns {Object} Objet contenant les tags organisés par catégorie
 */
export function getAllTags(recipesData = recipes) {
    return {
        ingredients: getIngredients(recipesData),
        appliances: getAppliances(recipesData),
        ustensils: getUstensils(recipesData)
    };
}

/**
 * Filtre les tags selon un terme de recherche
 * @param {Array} tags - Tableau des tags à filtrer
 * @param {string} searchTerm - Terme de recherche
 * @returns {Array} Tableau des tags filtrés
 */
export function filterTags(tags, searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
        return tags;
    }
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return tags.filter(tag => 
        tag.toLowerCase().includes(normalizedSearch)
    );
}