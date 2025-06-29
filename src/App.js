import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    if (img && img.type.startsWith("image/")) {
      setFile(img);
      setPreview(URL.createObjectURL(img));
      setOutputUrl(null);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleEnhance = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://api.deepai.org/api/torch-srgan",
        formData,
        {
          headers: {
            "api-key": "bd3633cd-2482-4794-af17-d56d90e54980",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.output_url) {
        setOutputUrl(response.data.output_url);
      } else {
        alert("Enhancement failed. Try another image.");
      }
    } catch (error) {
      console.error("Enhancement error:", error.response?.data || error.message);
      alert("Error: " + (error.response?.data?.err || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="glow-text">Image Upscaler</h1>
      <p className="description">
        Upload a blurry or low-res image and boost it to HD using futuristic AI.
      </p>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="image-container">
          <p className="label">📷 Uploaded Preview</p>
          <img src={preview} alt="Preview" className="image-box" />
        </div>
      )}

      <button onClick={handleEnhance} disabled={loading} className="enhance-btn">
        {loading ? "Enhancing..." : "Enhance to HD"}
      </button>

      {outputUrl && (
        <div className="image-container">
          <p className="label">🚀 Enhanced Output</p>
          <img src={outputUrl} alt="Enhanced" className="image-box" />
          <a href={outputUrl} download className="download-link">Download Image</a>
        </div>
      )}

      <footer className="footer">
        ⚡ Powered by <span className="brand">LeadingEdge</span> + DeepAI ⚡
      </footer>
    </div>
  );
}

export default App;
