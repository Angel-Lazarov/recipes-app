// frontend/components/RecipeModal.js
export default function RecipeModal({ recipe, onClose, onEdit, onDelete }) {
  if (!recipe) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>{recipe.title}</h2>
        <p><strong>Категория:</strong> {recipe.category}</p>
        <p><strong>Продукти:</strong> {recipe.ingredients?.join(', ')}</p>
        <p><strong>Стъпки:</strong> {recipe.steps?.join('\n')}</p>
        <div className="modal-buttons">
          <button onClick={() => onDelete(recipe.id)}>🗑️ Изтрий</button>
          <button onClick={() => onEdit(recipe)}>✏️ Редактирай</button>
        </div>
      </div>
    </div>
  );
}
