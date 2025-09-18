const API_URL = "https://your-render-server.onrender.com"; // смени с реалния URL на Render

const form = document.getElementById("recipeForm");
const recipeList = document.getElementById("recipeList");
const search = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const previewImage = document.getElementById("previewImage");
const showFormBtn = document.getElementById("showFormBtn");
const clearSearch = document.getElementById("clearSearch");

const defaultImage = "default.png";

showFormBtn.addEventListener("click", () => form.classList.toggle("show"));

async function fetchAllRecipes() {
  const res = await fetch(`${API_URL}/recipes`);
  return res.json();
}

async function loadAllRecipes() {
  const allRecipes = await fetchAllRecipes();
  const q = (search.value || "").toLowerCase();
  const selectedCategory = filterCategory.value;

  const filtered = allRecipes.filter(r => {
    const ingredientsArr = Array.isArray(r.ingredients) ? r.ingredients : String(r.ingredients).split(",").map(i => i.trim());
    const title = (r.title || "").toLowerCase();
    const ingredients = ingredientsArr.join(", ").toLowerCase();
    const matchesSearch = title.includes(q) || ingredients.includes(q);
    const matchesCategory = !selectedCategory || selectedCategory === "" || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  recipeList.innerHTML = "";
  filtered.forEach(r => {
    const ingredientsArr = Array.isArray(r.ingredients) ? r.ingredients : String(r.ingredients).split(",").map(i => i.trim());
    const stepsArr = Array.isArray(r.steps) ? r.steps : String(r.steps).split(".").map(s => s.trim());

    const div = document.createElement("div");
    div.className = "recipe";
    div.innerHTML = `
      <h3>${r.title}</h3>
      <p><b>Категория:</b> ${r.category}</p>
      <p><b>Съставки:</b> ${ingredientsArr.join(", ")}</p>
      <p><b>Стъпки:</b> ${stepsArr.join(". ")}</p>
      <img src="${r.image || defaultImage}" alt="${r.title}">
      <button onclick="handleDelete('${r.id}')">❌ Изтрий</button>
      <button onclick="handleEdit('${r.id}')">✏️ Редактирай</button>
    `;
    recipeList.appendChild(div);
  });

  // попълване на категории
  const categories = [...new Set(allRecipes.map(r => r.category || "").filter(Boolean))];
  filterCategory.innerHTML = `<option value="">Всички категории</option>`;
  categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filterCategory.appendChild(opt);
  });
}

window.handleDelete = async (id) => {
  await fetch(`${API_URL}/recipes/${id}`, { method: "DELETE" });
  await loadAllRecipes();
};

window.handleEdit = async (id) => {
  const allRecipes = await fetchAllRecipes();
  const recipe = allRecipes.find(r => r.id === id);
  if (!recipe) return;

  document.getElementById("title").value = recipe.title;
  document.getElementById("category").value = recipe.category;
  document.getElementById("ingredients").value = (Array.isArray(recipe.ingredients) ? recipe.ingredients : String(recipe.ingredients).split(",").map(i => i.trim())).join(", ");
  document.getElementById("steps").value = (Array.isArray(recipe.steps) ? recipe.steps : String(recipe.steps).split(".").map(s => s.trim())).join(". ");

  form.dataset.editingId = recipe.id;
  form.dataset.editingImage = recipe.image || defaultImage;
  previewImage.src = recipe.image || defaultImage;
  previewImage.style.display = "block";
  form.classList.add("show");
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("image")?.files?.[0];
  let imageUrl = form.dataset.editingImage || defaultImage;

  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Грешка при качване на изображението");
      const data = await response.json();
      imageUrl = data.url;
    } catch (err) {
      console.error(err);
      alert("Качването на изображението неуспя!");
      return;
    }
  }

  const recipeData = {
    title: document.getElementById("title").value,
    category: document.getElementById("category").value,
    ingredients: document.getElementById("ingredients").value.split(",").map(i => i.trim()),
    steps: document.getElementById("steps").value.split(".").map(s => s.trim()),
    image: imageUrl
  };

  if (form.dataset.editingId) {
    await fetch(`${API_URL}/recipes/${form.dataset.editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeData)
    });
    delete form.dataset.editingId;
  } else {
    await fetch(`${API_URL}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeData)
    });
  }

  form.reset();
  previewImage.src = "";
  previewImage.style.display = "none";
  delete form.dataset.editingImage;
  form.classList.remove("show");
  await loadAllRecipes();
});

search.addEventListener("input", loadAllRecipes);
filterCategory.addEventListener("change", loadAllRecipes);

clearSearch.addEventListener("click", () => { search.value = ""; loadAllRecipes(); clearSearch.style.display = "none"; });
search.addEventListener("input", () => { clearSearch.style.display = search.value ? "block" : "none"; });

loadAllRecipes();
