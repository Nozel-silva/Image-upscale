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
          "api-key": "bd3633cd-2482-4794-af17-d56d90e54980",  // ✅ Your key is here
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
       
