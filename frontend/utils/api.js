// frontend/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchRecipes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/recipes?${query}`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function createRecipe(data) {
  const res = await fetch(`${API_URL}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  return res.json();
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update recipe');
  return res.json();
}

export async function deleteRecipe(id) {
  const res = await fetch(`${API_URL}/recipes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete recipe');
  return res.json();
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const txt = await res.text().catch(()=>null);
    throw new Error('Upload failed: ' + (txt || res.status));
  }
  return res.json(); // { url }
}
