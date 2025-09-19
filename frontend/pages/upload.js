import { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Select a file first');

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.url) setUrl(data.url);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Upload Image</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>Upload</button>
      {url && (
        <div style={{ marginTop: '1rem' }}>
          <p>Uploaded Image:</p>
          <img src={url} alt="Uploaded" width={300} />
        </div>
      )}
    </div>
  );
}
