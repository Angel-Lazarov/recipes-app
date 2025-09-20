// frontend/components/RecipeForm.js
import { useState, useEffect } from 'react';
import { uploadImage, createRecipe, updateRecipe } from '../utils/api';

export default function RecipeForm({ show = false, recipe = null, onSaved, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Попълване на формата при edit
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setCategory(recipe.category || '');
      setIngredients((recipe.ingredients || []).join(', '));
      setSteps((recipe.steps || []).join('\n'));
      setImageUrl(recipe.imageUrl || '');
      setFile(null);
    }
  }, [recipe]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      let uploadedUrl = imageUrl;
      if (file) {
        const uploadRes = await uploadImage(file);
        uploadedUrl = uploadRes.url;
      }

      const data = {
        title,
        category,
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split('\n').map(s => s.trim()),
        imageUrl: uploadedUrl
      };

      let savedRecipe;
      if (recipe) {
        savedRecipe = await updateRecipe(recipe.id, data);
      } else {
        savedRecipe = await createRecipe(data);
      }

      onSaved(savedRecipe);

      // нулиране на формата след добавяне
      if (!recipe) {
        setTitle('');
        setCategory('');
        setIngredients('');
        setSteps('');
        setFile(null);
        setImageUrl('');
      }
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
      reader.onload = (ev) => setImageUrl(ev.target.result);
      reader.readAsDataURL(f);
    }
  };

  return (
    <form
      onSubmit={submit}
      className={show ? 'show' : ''}
      style={{ marginBottom: 20 }}
    >
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
        {imageUrl && <img src={imageUrl} alt="Preview" style={{ maxWidth: 150, marginTop: 10 }} />}
      </div>

      <div>
        <button type="submit" disabled={busy}>
          {busy ? (recipe ? 'Saving...' : 'Adding...') : (recipe ? 'Save' : 'Add Recipe')}
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
