// frontend/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
}

export async function createRecipe(data) {
  const res = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteRecipe(id) {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
