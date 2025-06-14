/**
 * Filtre les recettes selon une requête de recherche
 * @param {Array} recipes - Tableau des recettes
 * @param {string} query - Terme de recherche
 * @returns {Array} Recettes filtrées
 */
export function filterBySearch(recipes, query) {
    if (!query || query.length < 3) return recipes;

    const normalizedQuery = query.toLowerCase().trim();

    return recipes.filter(recipe => {
        // Recherche dans le nom
        if (recipe.name.toLowerCase().includes(normalizedQuery)) return true;

        // Recherche dans la description
        if (recipe.description.toLowerCase().includes(normalizedQuery)) return true;

        // Recherche dans les ingrédients
        if (recipe.ingredients.some(ingredient => 
            ingredient.ingredient.toLowerCase().includes(normalizedQuery)
        )) return true;

        return false;
    });
}

/**
 * Filtre les recettes selon les tags sélectionnés
 * @param {Array} recipes - Tableau des recettes
 * @param {Array} selectedTags - Tags sélectionnés
 * @returns {Array} Recettes filtrées
 */
export function filterByTags(recipes, selectedTags) {
    if (!selectedTags || selectedTags.length === 0) return recipes;

    return recipes.filter(recipe => {
        return selectedTags.every(tag => {
            const normalizedTag = tag.toLowerCase();

            // Vérifie dans les ingrédients
            const hasIngredient = recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(normalizedTag)
            );

            // Vérifie dans les appareils
            const hasAppliance = recipe.appliance && 
                recipe.appliance.toLowerCase().includes(normalizedTag);

            // Vérifie dans les ustensiles
            const hasUstensil = recipe.ustensils && 
                recipe.ustensils.some(ustensil =>
                    ustensil.toLowerCase().includes(normalizedTag)
                );

            return hasIngredient || hasAppliance || hasUstensil;
        });
    });
}

/**
 * Applique tous les filtres aux recettes
 * @param {Array} recipes - Tableau des recettes
 * @param {string} searchQuery - Terme de recherche
 * @param {Array} selectedTags - Tags sélectionnés
 * @returns {Array} Recettes filtrées
 */
export function applyAllFilters(recipes, searchQuery, selectedTags) {
    let filteredRecipes = recipes;

    // Applique le filtre de recherche
    filteredRecipes = filterBySearch(filteredRecipes, searchQuery);

    // Applique le filtre des tags
    filteredRecipes = filterByTags(filteredRecipes, selectedTags);

    return filteredRecipes;
}