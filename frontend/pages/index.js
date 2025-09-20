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

  const filteredRecipes = recipes.filter(r => {
    const nameMatch = r.title.toLowerCase().includes(filters.search.toLowerCase());
    const categoryMatch = r.category?.toLowerCase().includes(filters.category.toLowerCase());
    const ingredientMatch = filters.ingredient === '' || r.ingredients?.some(i => i.toLowerCase().includes(filters.ingredient.toLowerCase()));
    return nameMatch && categoryMatch && ingredientMatch;
  });

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>📖 Моите рецепти</h1>

      <button 
        id="showFormBtn" 
        onClick={() => setShowAdd(prev => !prev)} 
        style={{ marginBottom: 20 }}
      >
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

      <div style={{ marginBottom: 20 }}>
        <h3>Филтри</h3>
        <input
          placeholder="Търси по име"
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Филтър по категория"
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Филтър по съставка"
          value={filters.ingredient}
          onChange={e => setFilters(prev => ({ ...prev, ingredient: e.target.value }))}
        />
      </div>

      {loading ? <p>Зареждане...</p> : (
        <div id="recipeList">
          {filteredRecipes.map(r => (
            <div key={r.id} className="recipe">
              <h3>{r.title}</h3>
              <p>Категория: {r.category}</p>
              {r.imageUrl && <img src={r.imageUrl} alt={r.title} />}
              <div style={{ marginTop: 6 }}>
                <button onClick={() => onDelete(r.id)}>Изтрий</button>
                <button onClick={() => setEditing(r)}>Редактирай</button>
              </div>
              <p><strong>Съставки:</strong> {r.ingredients?.join(', ')}</p>
              <p><strong>Стъпки:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{r.steps?.join('\n')}</pre></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
