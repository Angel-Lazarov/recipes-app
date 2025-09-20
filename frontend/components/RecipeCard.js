// frontend/components/RecipeCard.js
export default function RecipeCard({ recipe, onEdit, onDelete }) {
  return (
    <div className="recipe">
      <h3>{recipe.title}</h3>
      <p><strong>Категория:</strong> {recipe.category}</p>

      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} />
      )}

      <p><strong>Съставки:</strong> {recipe.ingredients?.join(', ')}</p>
      <p><strong>Стъпки:</strong></p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.steps?.join('\n')}</p>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
        <button onClick={() => onDelete(recipe.id)}>🗑️ Изтрий</button>
        <button onClick={() => onEdit(recipe)}>✏️ Редактирай</button>
      </div>
    </div>
  );
}
