/**
 * Filtre les recettes selon une requête de recherche (VERSION BOUCLES NATIVES)
 * @param {Array} recipes - Tableau des recettes
 * @param {string} query - Terme de recherche
 * @returns {Array} Recettes filtrées
 */
export function filterBySearch(recipes, query) {
    if (!query || query.length < 3) return recipes;

    const normalizedQuery = query.toLowerCase().trim();
    const filteredRecipes = [];

    // Boucle principale sur toutes les recettes
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        let isMatch = false;

        // Vérification du nom de la recette
        if (recipe.name.toLowerCase().includes(normalizedQuery)) {
            isMatch = true;
        } 
        // Vérification de la description
        else if (recipe.description.toLowerCase().includes(normalizedQuery)) {
            isMatch = true;
        } 
        // Vérification des ingrédients avec boucle for
        else {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(normalizedQuery)) {
                    isMatch = true;
                    break; // Sortie anticipée dès qu'un ingrédient correspond
                }
            }
        }

        // Ajout de la recette si elle correspond
        if (isMatch) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
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