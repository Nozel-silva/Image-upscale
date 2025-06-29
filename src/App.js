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
      setOutputUrl(null); // reset previous result
    } else {
      alert("Please upload a valid image file (JPG/PNG)");
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
            "api-key": "bd3633cd-2482-4794-af17-d56d90e54980", // ✅ Your real API key
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
      <h1>Image Upscaler</h1>
      <p>Upload a blurry or low-res image and enhance it to HD using AI.</p>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="image-box">
          <p>Preview:</p>
          <img src={preview} alt="Preview" className="preview" />
        </div>
      )}

      <button onClick={handleEnhance} disabled={loading}>
        {loading ? "Enhancing..." : "Enhance Image"}
      </button>

      {outputUrl && (
        <div className="image-box">
          <p>Enhanced Result:</p>
          <img src={outputUrl} alt="HD Result" className="result" />
          <br />
          <a href={outputUrl} download>
            Download HD Image
          </a>
        </div>
      )}

      <footer>
        <p>Powered by LeadingEdge + DeepAI</p>
      </footer>
    </div>
  );
}

export default App;
    
