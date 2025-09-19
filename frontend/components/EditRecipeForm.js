// frontend/components/EditRecipeForm.js
import { useState, useEffect } from 'react';
import { uploadImage, updateRecipe } from '../utils/api';

export default function EditRecipeForm({ recipe, onUpdated, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setCategory(recipe.category || '');
      setIngredients((recipe.ingredients || []).join(', '));
      setSteps((recipe.steps || []).join('\n'));
    }
  }, [recipe]);

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

      const updatedRecipe = await updateRecipe(recipe.id, {
        title,
        category,
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split('\n').map(s => s.trim()),
        imageUrl
      });

      onUpdated(updatedRecipe);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  if (!recipe) return null;

  return (
    <form onSubmit={submit} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10 }}>
      <h3>Edit Recipe</h3>

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
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Update Recipe'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
