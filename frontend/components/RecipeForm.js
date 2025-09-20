// frontend/components/RecipeForm.js
import { useState, useEffect } from 'react';
import { uploadImage, createRecipe, updateRecipe } from '../utils/api';

export default function RecipeForm({ show, recipe = null, onSaved, onCancel }) {
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
    } else {
      setTitle('');
      setCategory('');
      setIngredients('');
      setSteps('');
      setPreview('');
    }
    setFile(null);
    setError('');
  }, [recipe, show]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(recipe?.imageUrl || '');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
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

      const saved = recipe ? await updateRecipe(recipe.id, data) : await createRecipe(data);
      onSaved(saved);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Грешка при запазване');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form 
      onSubmit={submit} 
      className={show ? 'show' : ''} 
      style={{ marginBottom: 20 }}
    >
      <label>Име на рецепта</label>
      <input 
        type="text" 
        value={title} 
        placeholder="Име на рецептата" 
        onChange={e => setTitle(e.target.value)} 
        required 
      />

      <label>Категория</label>
      <input 
        type="text" 
        value={category} 
        placeholder="Например: Супа, Десерт..." 
        onChange={e => setCategory(e.target.value)} 
        required 
      />

      <label>Съставки (разделени със запетаи)</label>
      <input 
        type="text" 
        value={ingredients} 
        placeholder="Например: захар, брашно, яйца" 
        onChange={e => setIngredients(e.target.value)} 
        required 
      />

      <label>Стъпки (нов ред за всяка стъпка)</label>
      <textarea 
        value={steps} 
        placeholder="Например: Смесете съставките..." 
        onChange={e => setSteps(e.target.value)} 
        required 
      />

      <label>Снимка (по избор)</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <img 
          src={preview} 
          alt="Преглед" 
          id="previewImage" 
          style={{ marginTop: 10, maxWidth: 200, display: 'block' }}
        />
      )}

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={busy}>
          {busy ? (recipe ? 'Запазване...' : 'Добавяне...') : (recipe ? 'Запази' : 'Добави')}
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          Отказ
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: 6 }}>{error}</p>}
    </form>
  );
}
