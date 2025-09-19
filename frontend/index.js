import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setUploadedUrl(data.url);
  };

  return (
    <div>
      <h1>Upload Demo</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {uploadedUrl && <img src={uploadedUrl} alt="Uploaded" width="300" />}
    </div>
  );
}
