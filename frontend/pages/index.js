import { useEffect, useState, useMemo } from 'react';
import { fetchRecipes, deleteRecipe } from '../utils/api';
import RecipeForm from '../components/RecipeForm';
import RecipeModal from '../components/RecipeModal';

// Utility функция за нормализация на категория
function normalizeCategory(cat) {
  if (!cat) return '';
  return cat.trim().charAt(0).toUpperCase() + cat.trim().slice(1).toLowerCase();
}

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: '', ingredient: '' });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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
      if (selectedRecipe?.id === id) setSelectedRecipe(null);
    } catch (err) {
      console.error(err);
      alert('Грешка при изтриване');
    }
  };

  // Категории без дублиране и с нормализация
  const categories = useMemo(() => {
    return Array.from(new Set(recipes.map(r => normalizeCategory(r.category)).filter(Boolean))).sort();
  }, [recipes]);

  // Филтрирани рецепти
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const nameMatch = r.title.toLowerCase().includes(filters.search.toLowerCase());
      const categoryMatch = !filters.category || normalizeCategory(r.category) === filters.category;
      const ingredientFilters = filters.ingredient
        .split(',')
        .map(i => i.trim().toLowerCase())
        .filter(Boolean);
      const ingredientMatch = ingredientFilters.every(f =>
        r.ingredients?.some(i => i.toLowerCase().includes(f))
      );
      return nameMatch && categoryMatch && ingredientMatch;
    });
  }, [recipes, filters]);

  const DEFAULT_IMAGE = 'https://placehold.co/300x200/cccccc/ffffff?text=Без+снимка';

  return (
    <div>
      <h1>📖 Моите рецепти</h1>

      <button id="showFormBtn" onClick={() => {
        setShowAdd(true);
        setEditing(null);
      }}>
        ➕ Добави нова рецепта
      </button>

      {/* Форма за добавяне или редакция */}
      {(showAdd || editing) && (
        <div className="form-wrapper">
          <RecipeForm
            show={showAdd || !!editing}
            recipe={editing}
            categories={categories}
            onSaved={onSaved}
            onCancel={() => { setShowAdd(false); setEditing(null); }}
          />
        </div>
      )}

      {/* Филтри */}
      <div className="filters-container">
        <h2>Търси по</h2>

        <div className="filter-item">
          <label>Име</label>
          <input
            placeholder="Супа от зеленчуци"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="filter-item">
          <label>Категория</label>
          <select
            value={filters.category}
            onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Всички категории</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Съставки</label>
          <input
            placeholder="захар, брашно, яйца"
            value={filters.ingredient}
            onChange={e => setFilters(prev => ({ ...prev, ingredient: e.target.value }))}
          />
        </div>
      </div>

      {/* Списък с рецепти */}
      {loading ? <p>Зареждане...</p> : (
        <div id="recipeList">
          {filteredRecipes.length === 0 ? (
            <p>Няма намерени рецепти</p>
          ) : (
            filteredRecipes.map(r => (
              <div
                className="recipe"
                key={r.id}
                onClick={() => setSelectedRecipe(r)}
              >
                <h3>{r.title}</h3>
                <p><strong>Категория:</strong> {normalizeCategory(r.category)}</p>
                <img src={r.imageUrl || DEFAULT_IMAGE} alt={r.title} />
                <p><strong>Съставки:</strong> {r.ingredients?.join(', ')}</p>
                <p><strong>Стъпки:</strong> <pre>{r.steps?.join('\n')}</pre></p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Модал за детайли */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={() => {
            setEditing(selectedRecipe);
            setShowAdd(false);
            setSelectedRecipe(null);
          }}
          onDelete={() => onDelete(selectedRecipe.id)}
        />
      )}
    </div>
  );
}
