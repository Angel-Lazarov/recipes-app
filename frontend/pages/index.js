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

  useEffect(() => {
    fetchRecipes()
      .then(data => setRecipes(data))
      .catch(err => {
        console.error(err);
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const onAdded = (r) => setRecipes(prev => [...prev, r]);
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

      {editing ? (
        <EditRecipeForm
          recipe={editing}
          onUpdated={onUpdated}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <AddRecipeForm onAdded={onAdded} />
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
        <ul>
          {filteredRecipes.map(r => (
            <li key={r.id} style={{ marginBottom: 12 }}>
              <strong>{r.title}</strong> ({r.category})<br />
              {r.imageUrl && <img src={r.imageUrl} alt={r.title} width={160} style={{ display: 'block', marginTop: 6 }} />}
              <div style={{ marginTop: 6 }}>
                <button onClick={() => setEditing(r)}>Edit</button>
                <button onClick={() => onDelete(r.id)} style={{ marginLeft: 8 }}>Delete</button>
              </div>
              <div style={{ marginTop: 6 }}>
                <strong>Ingredients:</strong> {r.ingredients?.join(', ')}<br />
                <strong>Steps:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{r.steps?.join('\n')}</pre>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
