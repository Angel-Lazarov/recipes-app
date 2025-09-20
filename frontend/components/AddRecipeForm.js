// frontend/components/AddRecipeForm.js
import { useState } from 'react';
import { uploadImage, createRecipe } from '../utils/api';

export default function AddRecipeForm({ onAdded, onCancel, show }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let imageUrl = '';
      if (file) {
        const uploadRes = await uploadImage(file);
        imageUrl = uploadRes.url;
      }

      const newRecipe = await createRecipe({
        title,
        category,
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split('\n').map(s => s.trim()),
        imageUrl
      });

      onAdded(newRecipe);

      // нулиране на формата
      setTitle('');
      setCategory('');
      setIngredients('');
      setSteps('');
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={show ? 'show' : ''} style={{ marginBottom: 20 }}>
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
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Add Recipe'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
