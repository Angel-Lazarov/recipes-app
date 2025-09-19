import { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../utils/api';
import AddRecipeForm from '../components/AddRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' или 'desc'
  const [editingRecipe, setEditingRecipe] = useState(null);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await fetchRecipes();
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
  }, []);

  const onAdded = (r) => setRecipes(prev => [...prev, r]);
  const onUpdated = (updated) =>
    setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r));

  const onDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const filteredRecipes = recipes
    .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Recipes</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>

      {editingRecipe ? (
        <EditRecipeForm
          recipe={editingRecipe}
          onUpdated={onUpdated}
          onCancel={() => setEditingRecipe(null)}
        />
      ) : (
        <AddRecipeForm onAdded={onAdded} />
      )}

      {loading ? <p>Loading...</p> : (
        <ul>
          {filteredRecipes.map(r => (
            <li key={r.id} style={{ marginBottom: 12 }}>
              <strong>{r.title}</strong><br />
              {r.imageUrl && <img src={r.imageUrl} alt={r.title} width={160} style={{ display: 'block', marginTop: 6 }} />}
              <div style={{ marginTop: 6 }}>
                <button onClick={() => setEditingRecipe(r)}>Edit</button>
                <button onClick={() => onDelete(r.id)} style={{ marginLeft: 6 }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
