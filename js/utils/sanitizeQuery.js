/**
 * Nettoie et sécurise une requête de recherche
 * @param {string} query - Requête à nettoyer
 * @returns {string} Requête nettoyée
 */
export function sanitizeQuery(query) {
    if (!query || typeof query !== 'string') return '';
    
    // Supprime les caractères potentiellement dangereux
    const cleanQuery = query
        .replace(/[<>'";&\\]/g, '') // Supprime les caractères spéciaux
        .replace(/--/g, '') // Supprime les commentaires SQL
        .replace(/\/\*/g, '') // Supprime les commentaires multilignes
        .replace(/\*\//g, '')
        .replace(/\s+/g, ' ') // Remplace les espaces multiples par un seul
        .trim(); // Supprime les espaces en début/fin
    
    // Limite la longueur pour éviter les attaques par déni de service
    return cleanQuery.substring(0, 100);
}