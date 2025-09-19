import { useState, useEffect } from 'react';
import { uploadImage, createRecipe, updateRecipe } from '../utils/api';

export default function AddRecipeForm({ onAdded, onUpdated, initialData = null, onCancel }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setFile(null); // нов файл по избор
    }
  }, [initialData]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let imageUrl = initialData?.imageUrl || '';
      if (file) {
        const uploadRes = await uploadImage(file);
        imageUrl = uploadRes.url;
      }

      if (isEdit) {
        const updated = await updateRecipe(initialData.id, { title, imageUrl });
        onUpdated(updated);
      } else {
        const newRecipe = await createRecipe({ title, imageUrl });
        onAdded(newRecipe);
      }

      setTitle('');
      setFile(null);
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
        <button type="submit" disabled={busy}>
          {busy ? 'Saving...' : isEdit ? 'Update Recipe' : 'Add Recipe'}
        </button>
        {isEdit && onCancel && (
          <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
