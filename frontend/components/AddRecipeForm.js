import { useState } from 'react';
import { addRecipe, uploadImage } from '../utils/api';

export default function AddRecipeForm({ onRecipeAdded }) {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = '';
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imageUrl = uploadRes.url;
      }

      const newRecipe = await addRecipe({ title, imageUrl });
      onRecipeAdded(newRecipe);
      setTitle('');
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Recipe Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Recipe'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
