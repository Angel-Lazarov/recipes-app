// frontend/pages/api/recipes.js
export async function getRecipes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}
