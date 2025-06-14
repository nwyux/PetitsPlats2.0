function createRecipeCard(recipe) {
    return `
        <article class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
                <img 
                    src="assets/images/${recipe.image}" 
                    alt="${recipe.name}"
                    class="w-full h-64 object-cover"
                />
                <div class="absolute top-4 right-4 bg-custom-yellow text-black px-3 py-1 rounded-full font-semibold">
                    ${recipe.time}min
                </div>
            </div>
            
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">${recipe.name}</h3>
                
                <div class="mb-4">
                    <h4 class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Recette</h4>
                    <p class="text-gray-700 text-sm leading-relaxed line-clamp-4">${recipe.description}</p>
                </div>
                
                <div>
                    <h4 class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Ingrédients</h4>
                    <div class="grid grid-cols-2 gap-2">
                        ${recipe.ingredients.map(ingredient => `
                            <div class="text-sm">
                                <span class="font-medium text-gray-800">${ingredient.ingredient}</span>
                                ${ingredient.quantity || ingredient.unit ? 
                                    `<br><span class="text-gray-600">${ingredient.quantity || ''} ${ingredient.unit || ''}</span>` 
                                    : ''
                                }
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </article>
    `;
}

export function renderRecipes(recipes, container) {
    if (!container) {
        console.error('Container not found');
        return;
    }
    
    const recipesGrid = `
        <div class="max-w-7xl mx-auto px-8 py-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${recipes.map(recipe => createRecipeCard(recipe)).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = recipesGrid;
}