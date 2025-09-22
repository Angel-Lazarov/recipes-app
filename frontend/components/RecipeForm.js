import { useState, useEffect } from 'react';
import { uploadImage, createRecipe, updateRecipe } from '../utils/api';

export default function RecipeForm({ show, recipe = null, categories = [], onSaved, onCancel }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const DEFAULT_IMAGE = 'https://placehold.co/300x200/cccccc/ffffff?text=Без+снимка';

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setCategory(recipe.category || '');
      setIngredients((recipe.ingredients || []).join(', '));
      setSteps((recipe.steps || []).join('\n'));
      setPreview(recipe.imageUrl || DEFAULT_IMAGE);
    } else {
      setTitle('');
      setCategory('');
      setIngredients('');
      setSteps('');
      setPreview(DEFAULT_IMAGE);
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
      setPreview(recipe?.imageUrl || DEFAULT_IMAGE);
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

  if (!show) return null;

  // Проверка дали категорията е нова
  const isNewCategory = category && !categories.includes(category);

  return (
    <form onSubmit={submit}>
      <div className="form-item">
        <label>Име на рецепта</label>
        <input
          type="text"
          value={title}
          placeholder="Супа от зеленчуци"
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label>Категория</label>
        <select
          value={categories.includes(category) ? category : '__new__'}
          onChange={e => {
            if (e.target.value === '__new__') {
              setCategory('');
            } else {
              setCategory(e.target.value);
            }
          }}
        >
          <option value="">Избери категория</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="__new__">+ Нова категория</option>
        </select>

        {(isNewCategory || category === '') && (
          <input
            type="text"
            value={category}
            placeholder="Въведи нова категория"
            onChange={e => setCategory(e.target.value)}
            required
          />
        )}
      </div>

      <div className="form-item">
        <label>Съставки</label>
        <input
          type="text"
          value={ingredients}
          placeholder="захар, брашно, яйца"
          onChange={e => setIngredients(e.target.value)}
          required
        />
        <small>Разделени със запетая</small>
      </div>

      <div className="form-item">
        <label>Стъпки</label>
        <textarea
          value={steps}
          placeholder="Смесете съставките..."
          onChange={e => setSteps(e.target.value)}
          required
        />
      </div>

      <div className="form-item">
        <label>Снимка (по избор)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {preview && <img src={preview} alt="Преглед" />}

      <div className="form-buttons">
        <button type="submit" disabled={busy}>
          {busy ? (recipe ? 'Запазване...' : 'Добавяне...') : (recipe ? 'Запази' : 'Добави')}
        </button>
        <button type="button" onClick={onCancel}>Отказ</button>
      </div>

      {error && <p className="error">{error}</p>}
    </form>
  );
}
