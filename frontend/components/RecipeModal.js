// frontend/components/RecipeModal.js
export default function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h2>{recipe.title}</h2>
        <p><strong>Категория:</strong> {recipe.category}</p>
        {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
        <p><strong>Съставки:</strong> {recipe.ingredients?.join(', ')}</p>
        <p><strong>Стъпки:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.steps?.join('\n')}</p>
      </div>
    </div>
  );
}
