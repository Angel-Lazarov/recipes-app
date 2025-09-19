import { useState } from "react";
import { uploadImage } from "../utils/api";

export default function UploadImage({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return setError("Select a file first!");
    setLoading(true);
    setError("");

    try {
      const result = await uploadImage(file);
      onUpload(result.url);
    } catch (err) {
      setError("Upload failed!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
