// ImageUpscaler.jsx
import React, { useState } from "react";
import axios from "axios";

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
    <div className="p-6 max-w-xl mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">Image HD Upscaler</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" className="max-w-full mx-auto mt-4 rounded-lg" />}
      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Enhancing..." : "Enhance Image"}
      </button>
      {outputUrl && (
        <div>
          <h2 className="text-xl mt-6">HD Result:</h2>
          <img src={outputUrl} alt="Enhanced" className="max-w-full mt-2 rounded-lg" />
          <a
            href={outputUrl}
            download
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download HD
          </a>
        </div>
      )}
    </div>
  );
    }
  
