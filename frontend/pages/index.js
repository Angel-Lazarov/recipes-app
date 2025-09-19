import { useEffect, useState } from "react";
import { fetchRecipes, createRecipe } from "../utils/api";
import UploadImage from "../components/UploadImage";

export default function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes().then(setRecipes);
  }, []);

  const handleUpload = (url) => {
    const newRecipe = { title: "New Recipe", image: url };
    createRecipe(newRecipe).then((r) => setRecipes((prev) => [...prev, newRecipe]));
  };

  return (
    <div>
      <h1>Recipes</h1>
      <UploadImage onUpload={handleUpload} />
      <ul>
        {recipes.map((r, i) => (
          <li key={i}>
            {r.title} {r.image && <img src={r.image} alt={r.title} width={100} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
