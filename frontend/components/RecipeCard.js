// frontend/components/RecipeCard.js
export default function RecipeCard({ recipe, onSelect }) {
  return (
    <div
      className="recipe"
      onClick={() => onSelect(recipe)}
      style={{ cursor: 'pointer' }}
    >
      <h3>{recipe.title}</h3>
      <p><strong>Категория:</strong> {recipe.category}</p>
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} />
      )}
      <p><strong>Съставки:</strong> {recipe.ingredients?.join(', ')}</p>
      <p><strong>Стъпки:</strong></p>
      <p style={{ whiteSpace: 'pre-wrap', overflow: 'hidden', maxHeight: '60px', textOverflow: 'ellipsis' }}>
        {recipe.steps?.join('\n')}
      </p>
    </div>
  );
}
