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
        if (recipe.name.toLowerCase().includes(normalizedQuery)) return true;

        if (recipe.description.toLowerCase().includes(normalizedQuery)) return true;

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

            const hasIngredient = recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().includes(normalizedTag)
            );

            const hasAppliance = recipe.appliance && 
                recipe.appliance.toLowerCase().includes(normalizedTag);

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

    filteredRecipes = filterBySearch(filteredRecipes, searchQuery);

    filteredRecipes = filterByTags(filteredRecipes, selectedTags);

    return filteredRecipes;
}