// ImageUpscaler.jsx
import React, { useState } from "react";
import axios from "axios";
import './App.css';

export default function ImageUpscaler() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    setFile(img);
    setPreview(URL.createObjectURL(img));
    setOutputUrl(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("https://api.deepai.org/api/torch-srgan", formData, {
        headers: {
          "api-key": "YOUR_DEEPAI_API_KEY",
          "Content-Type": "multipart/form-data",
        },
      });
      setOutputUrl(response.data.output_url);
    } catch (error) {
      alert("Error enhancing image.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🔍 Image HD Upscaler</h1>
      <p className="subtitle">Upload any blurry or low-resolution image and get a high-quality HD version in seconds.</p>
      <p className="instructions">1. Select an image (PNG or JPG).<br />2. Tap "Enhance Image".<br />3. Download the improved version.</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="image-box"
        />
      )}

      <button
        className="enhance-btn"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Enhancing..." : "Enhance Image"}
      </button>

      {outputUrl && (
        <div>
          <h2 className="result-title">🔧 Enhanced Result:</h2>
          <img src={outputUrl} alt="Enhanced" className="image-box" />
          <a
            href={outputUrl}
            download
            className="download-btn"
          >
            ⬇ Download HD Image
          </a>
        </div>
      )}

      <footer className="footer">⚡ Powered by <strong>LeadingEdge Virtual Insight</strong></footer>
    </div>
  );
       }
       
