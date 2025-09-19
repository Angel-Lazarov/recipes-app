import { useEffect, useState } from 'react';
import { fetchRecipes, deleteRecipe } from '../utils/api';
import AddRecipeForm from '../components/AddRecipeForm';
import EditRecipeForm from '../components/EditRecipeForm';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // рецептата, която се редактира

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

  const onDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const onSaved = (updated) => {
    setRecipes(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditing(null);
  };

  const onCancelEdit = () => setEditing(null);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Recipes</h1>

      <AddRecipeForm onAdded={onAdded} />

      {loading ? <p>Loading...</p> : (
        <ul>
          {recipes.map(r => (
            <li key={r.id} style={{ marginBottom: 12 }}>
              {editing && editing.id === r.id ? (
                <EditRecipeForm
                  recipe={r}
                  onSaved={onSaved}
                  onCancel={onCancelEdit}
                />
              ) : (
                <>
                  <strong>{r.title}</strong><br />
                  {r.imageUrl && <img src={r.imageUrl} alt={r.title} width={160} style={{ display: 'block', marginTop: 6 }} />}
                  <div style={{ marginTop: 6 }}>
                    <button onClick={() => setEditing(r)}>Edit</button>
                    <button onClick={() => onDelete(r.id)} style={{ marginLeft: 10 }}>Delete</button>
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
