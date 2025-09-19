import { useState } from 'react';
import { uploadImage, updateRecipe } from '../utils/api';

export default function EditRecipeForm({ recipe, onUpdated, onCancel }) {
  const [title, setTitle] = useState(recipe.title);
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
      const updated = await updateRecipe(recipe.id, { title, imageUrl });
      onUpdated(updated);
      onCancel();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <div>
        <label>Title</label><br />
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div style={{ marginTop: 8 }}>
        <label>Image (optional)</label><br />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Update Recipe'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 6 }}>Cancel</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
