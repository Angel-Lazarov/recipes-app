// frontend/components/EditRecipeForm.js
import { useState, useEffect } from 'react';
import { uploadImage, updateRecipe } from '../utils/api';

export default function EditRecipeForm({ recipe, onUpdated, onCancel }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setFile(null); // няма да презаписваме съществуващата снимка докато не се избере нова
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
      const updated = await updateRecipe(recipe.id, { title, imageUrl });
      if (typeof onUpdated === 'function') {
        onUpdated(updated);
      }
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
        {recipe.imageUrl && !file && (
          <div style={{ marginTop: 6 }}>
            <img src={recipe.imageUrl} alt={recipe.title} width={160} />
          </div>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save Changes'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
