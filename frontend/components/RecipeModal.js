// frontend/components/RecipeModal.js
export default function RecipeModal({ recipe, onClose, onEdit, onDelete }) {
  if (!recipe) return null;

  const DEFAULT_IMAGE = 'https://placehold.co/300x200/cccccc/ffffff?text=Без+снимка';

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>{recipe.title}</h2>
        <p><strong>Категория:</strong> {recipe.category}</p>
        <img src={recipe.imageUrl || DEFAULT_IMAGE} alt={recipe.title} />
        <p><strong>Съставки:</strong> {recipe.ingredients?.join(', ')}</p>

        <p><strong>Стъпки:</strong> {recipe.steps?.join('\n')}</p>

        {/* <p><strong>Стъпки:</strong></p>
        <pre>{recipe.steps?.join('\n')}</pre> */}

        <div className="modal-buttons">
          <button onClick={() => onDelete(recipe.id)}>🗑️ Изтрий</button>
          <button onClick={() => onEdit(recipe)}>✏️ Редактирай</button>
        </div>
      </div>
    </div>
  );
}
