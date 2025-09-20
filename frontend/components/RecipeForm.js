import { useState, useEffect } from 'react';
import { uploadImage, createRecipe, updateRecipe } from '../utils/api';

export default function RecipeForm({ show = false, recipe = null, onSaved, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setCategory(recipe.category || '');
      setIngredients((recipe.ingredients || []).join(', '));
      setSteps((recipe.steps || []).join('\n'));
      setPreview(recipe.imageUrl || '');
      setFile(null);
    } else {
      setTitle('');
      setCategory('');
      setIngredients('');
      setSteps('');
      setPreview('');
      setFile(null);
    }
  }, [recipe, show]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let imageUrl = preview;
      if (file) {
        const res = await uploadImage(file);
        imageUrl = res.url;
      }

      const data = {
        title,
        category,
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split('\n').map(s => s.trim()),
        imageUrl
      };

      let saved;
      if (recipe) {
        saved = await updateRecipe(recipe.id, data);
      } else {
        saved = await createRecipe(data);
      }

      onSaved(saved);

      setTitle('');
      setCategory('');
      setIngredients('');
      setSteps('');
      setFile(null);
      setPreview('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview('');
    }
  };

  return (
    <form onSubmit={submit} className={show ? 'show' : ''} style={{ marginBottom: 20 }}>
      <div>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div>
        <label>Category</label>
        <input value={category} onChange={e => setCategory(e.target.value)} required />
      </div>

      <div>
        <label>Ingredients (comma separated)</label>
        <input value={ingredients} onChange={e => setIngredients(e.target.value)} required />
      </div>

      <div>
        <label>Steps (newline separated)</label>
        <textarea value={steps} onChange={e => setSteps(e.target.value)} required />
      </div>

      <div>
        <label>Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {preview && <img src={preview} alt="Preview" style={{ width: 160, marginTop: 6 }} />}

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : recipe ? 'Save' : 'Add Recipe'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
