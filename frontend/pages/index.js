// frontend/pages/index.js
import { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../utils/api';
import AddRecipeForm from '../components/AddRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);

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
    setEditingRecipe(null);
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

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Recipes</h1>

      {!editingRecipe && <AddRecipeForm onAdded={onAdded} />}

      {loading ? <p>Loading...</p> : (
        <ul>
          {recipes.map(r => (
            <li key={r.id} style={{ marginBottom: 12 }}>
              {editingRecipe?.id === r.id ? (
                <EditRecipeForm
                  recipe={editingRecipe}
                  onUpdated={onUpdated}
                  onCancel={() => setEditingRecipe(null)}
                />
              ) : (
                <>
                  <strong>{r.title}</strong><br />
                  {r.imageUrl && <img src={r.imageUrl} alt={r.title} width={160} style={{ display: 'block', marginTop: 6 }} />}
                  <div style={{ marginTop: 6 }}>
                    <button onClick={() => setEditingRecipe(r)}>Edit</button>
                    <button onClick={() => onDelete(r.id)} style={{ marginLeft: 8 }}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
