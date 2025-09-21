export default function RecipeCard({ recipe, onEdit, onDelete }) {
  return (
    <div className="recipe">
      <h3>{recipe.title}</h3>
      <p><strong>Категория:</strong> {recipe.category}</p>
      <img src={recipe.imageUrl || 'https://placehold.co/300x200/cccccc/ffffff?text=Без+снимка'} alt={recipe.title} />
      <p><strong>Съставки:</strong> {recipe.ingredients?.join(', ')}</p>
      <p><strong>Стъпки:</strong></p>
      <div className="recipe-steps-preview">{recipe.steps?.slice(0, 3).join('\n')}</div>

      <div className="buttons">
        <button onClick={() => onDelete(recipe.id)}>🗑️ Изтрий</button>
        <button onClick={() => onEdit(recipe)}>✏️ Редактирай</button>
      </div>
    </div>
  );
}
