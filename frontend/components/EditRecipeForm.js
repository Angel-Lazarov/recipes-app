// frontend/components/EditRecipeForm.js
import { useState } from 'react';
import { updateRecipe, uploadImage } from '../utils/api';

export default function EditRecipeForm({ recipe, onUpdated, onCancel }) {
  const [title, setTitle] = useState(recipe.title);
  const [category, setCategory] = useState(recipe.category || '');
  const [ingredients, setIngredients] = useState(recipe.ingredients?.join(', ') || '');
  const [steps, setSteps] = useState(recipe.steps?.join('\n') || '');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let imageUrl = recipe.imageUrl || '';
      if (file) {
        const uploadRes = await uploadImage(file);
        imageUrl = uploadRes.url;
      }

      const updated = await updateRecipe(recipe.id, {
        title,
        category,
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split('\n').map(s => s.trim()),
        imageUrl
      });

      onUpdated(updated);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <h3>✏️ Редактирай рецепта</h3>

      <div>
        <label>Title</label><br />
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Category</label><br />
        <input value={category} onChange={e => setCategory(e.target.value)} required />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Ingredients (comma separated)</label><br />
        <input value={ingredients} onChange={e => setIngredients(e.target.value)} required />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Steps (newline separated)</label><br />
        <textarea value={steps} onChange={e => setSteps(e.target.value)} required />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Image (optional)</label><br />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        {recipe.imageUrl && (
          <div style={{ marginTop: 6 }}>
            <img src={recipe.imageUrl} alt={recipe.title} width={120} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        <button
          type="button"
          onClick={onCancel}
          style={{ marginLeft: 8, backgroundColor: '#ccc' }}
        >
          ❌ Отказ
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
