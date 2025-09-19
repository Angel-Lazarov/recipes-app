// frontend/components/RecipeFilterSort.js
import { useState } from 'react';

export default function RecipeFilterSort({ onFilter }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(''); // '', 'asc', 'desc'

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onFilter({ search: e.target.value, sort });
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    onFilter({ search, sort: e.target.value });
  };

  return (
    <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
      />

      <select value={sort} onChange={handleSortChange}>
        <option value="">Sort by title</option>
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>
    </div>
  );
}
