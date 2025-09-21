import { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../utils/api';
import RecipeForm from '../components/RecipeForm';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', ingredient: '' });

  useEffect(() => {
    fetchRecipes()
      .then(data => setRecipes(data))
      .catch(err => {
        console.error(err);
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSaved = (r) => {
    const exists = recipes.find(p => p.id === r.id);
    if (exists) {
      setRecipes(prev => prev.map(p => p.id === r.id ? r : p));
      setEditing(null);
    } else {
      setRecipes(prev => [...prev, r]);
      setShowAdd(false);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Грешка при изтриване');
    }
  };

  // Генерираме уникални категории с първа главна буква и сортираме по азбучен ред
  const categories = Array.from(
    new Set(recipes.map(r => r.category).filter(Boolean))
  )
    .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase())
    .sort();

  const filteredRecipes = recipes.filter(r => {
    const nameMatch = r.title.toLowerCase().includes(filters.search.toLowerCase());
    const categoryMatch = !filters.category || 
      (r.category && (r.category.charAt(0).toUpperCase() + r.category.slice(1).toLowerCase()) === filters.category);

    // Мултифилтър за съставки
    const ingredientFilters = filters.ingredient
      .split(',')
      .map(i => i.trim().toLowerCase())
      .filter(Boolean);

    const ingredientMatch = ingredientFilters.every(f =>
      r.ingredients?.some(i => i.toLowerCase().includes(f))
    );

    return nameMatch && categoryMatch && ingredientMatch;
  });

  return (
    <div>
      <h1>📖 Моите рецепти</h1>

      <button id="showFormBtn" onClick={() => setShowAdd(prev => !prev)}>
        ➕ Добави нова рецепта
      </button>

      {showAdd && !editing && (
        <RecipeForm 
          show={showAdd} 
          onSaved={onSaved} 
          onCancel={() => setShowAdd(false)} 
        />
      )}

      {editing && (
        <RecipeForm 
          show={!!editing} 
          recipe={editing} 
          onSaved={onSaved} 
          onCancel={() => setEditing(null)} 
        />
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          className="filter-input"
          placeholder="Търси по име"
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />

        <select
          className="filter-input"
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">Всички категории</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          className="filter-input"
          placeholder="Филтър по съставки (разделени със запетаи)"
          value={filters.ingredient}
          onChange={e => setFilters(prev => ({ ...prev, ingredient: e.target.value }))}
        />
      </div>

      {loading ? <p>Зареждане...</p> : (
        <div id="recipeList">
          {filteredRecipes.map(r => (
            <div className="recipe" key={r.id}>
              <h3>{r.title}</h3>
              <p><strong>Категория:</strong> {r.category}</p>
              {r.imageUrl && <img src={r.imageUrl} alt={r.title} />}
              <p><strong>Съставки:</strong> {r.ingredients?.join(', ')}</p>
              <p><strong>Стъпки:</strong> <pre>{r.steps?.join('\n')}</pre></p>
              <div className="buttons">
                <button onClick={() => onDelete(r.id)}>Изтрий</button>
                <button onClick={() => setEditing(r)}>Редактирай</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
