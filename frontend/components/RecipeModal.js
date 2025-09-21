// frontend/components/RecipeModal.js
export default function RecipeModal({ recipe, onClose, onEdit, onDelete }) {
  if (!recipe) return null;

  const handleDelete = () => {
    if (confirm('Сигурни ли сте, че искате да изтриете тази рецепта?')) {
      onDelete(recipe.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>

        <h2>{recipe.title}</h2>
        <p><strong>Категория:</strong> {recipe.category}</p>
        <img src={recipe.imageUrl || 'https://placehold.co/300x200/cccccc/ffffff?text=Без+снимка'} alt={recipe.title} />

        <p><strong>Съставки:</strong></p>
        <ul>
          {recipe.ingredients?.map((i, idx) => <li key={idx}>{i}</li>)}
        </ul>

        <p><strong>Стъпки:</strong></p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{recipe.steps?.join('\n')}</pre>

        <div className="modal-buttons">
          <button onClick={onEdit}>✏️ Редакция</button>
          <button onClick={handleDelete}>🗑️ Изтриване</button>
        </div>
      </div>
    </div>
  );
}
