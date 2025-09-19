// frontend/pages/index.js
import { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../utils/api';
import AddRecipeForm from '../components/AddRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', ingredient: '' });

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await fetchRecipes(filters);
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [filters]);

  const onAdded = (r) => setRecipes(prev => [...prev, r]);
  const onUpdated = (r) => setRecipes(prev => prev.map(p => p.id === r.id ? r : p));
  const onDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Recipes</h1>

      <div style={{ marginBottom: 20 }}>
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

      {editing ? (
        <EditRecipeForm
          recipe={editing}
          onSaved={(r) => { onUpdated(r); setEditing(null); }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <AddRecipeForm onAdded={onAdded} />
      )}

      {loading ? <p>Loading...</p> : (
        <ul>
          {recipes.map(r => (
            <li key={r.id} style={{ marginBottom: 12 }}>
              <strong>{r.title}</strong> ({r.category})<br />
              {r.imageUrl && <img src={r.imageUrl} alt={r.title} width={160} style={{ display: 'block', marginTop: 6 }} />}
              <div>Ingredients: {r.ingredients.join(', ')}</div>
              <div>Steps: {r.steps}</div>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => setEditing(r)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => onDelete(r.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
