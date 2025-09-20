// frontend/pages/index.js
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

  const onAdded = (r) => {
    setRecipes(prev => [...prev, r]);
    setShowAdd(false);
  };

  const onUpdated = (r) => {
    setRecipes(prev => prev.map(p => p.id === r.id ? r : p));
    setEditing(null);
  };

  const onDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
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
      <h1>Recipes</h1>

      <button id="showFormBtn" onClick={() => setShowAdd(prev => !prev)}>
        {showAdd ? '➖ Hide Form' : '➕ Add New Recipe'}
      </button>

      {/* Add Form */}
      {showAdd && !editing && (
        <RecipeForm
          show={showAdd}
          onSaved={onAdded}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* Edit Form */}
      {editing && (
        <RecipeForm
          show={!!editing}
          recipe={editing}
          onSaved={onUpdated}
          onCancel={() => setEditing(null)}
        />
      )}

      <div style={{ marginBottom: 20 }}>
        <h3>Filters</h3>
        <input
          placeholder="Search by name"
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Filter by category"
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Filter by ingredient"
          value={filters.ingredient}
          onChange={e => setFilters(prev => ({ ...prev, ingredient: e.target.value }))}
        />
      </div>

      {loading ? <p>Loading...</p> : (
        <div id="recipeList">
          {filteredRecipes.map(r => (
            <div key={r.id} className="recipe">
              <h3>{r.title}</h3>
              <p>Category: {r.category}</p>
              {r.imageUrl && <img src={r.imageUrl} alt={r.title} />}
              <div style={{ marginTop: 6 }}>
                <button onClick={() => onDelete(r.id)}>Delete</button>
                <button onClick={() => setEditing(r)}>Edit</button>
              </div>
              <div style={{ marginTop: 6 }}>
                <strong>Ingredients:</strong> {r.ingredients?.join(', ')}<br />
                <strong>Steps:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{r.steps?.join('\n')}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
