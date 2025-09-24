import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setText("");
    }
  };

  // Handle paste
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (let item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          setImage(file);
          setPreview(URL.createObjectURL(file));
          setText("");
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Send to backend
  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      
      const res = await fetch("https://ocr-backend-ry7i.onrender.com/ocr", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setText(data.text);
    } catch (error) {
      console.error(error);
      setText("Error extracting text.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setText("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title"> OCR Extractor</h1>

      {!preview && (
        <label className="upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <p>
            Click here or drag & drop an image, or paste it with <b>Ctrl+V</b>
          </p>
        </label>
      )}

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="preview" className="preview-img" />
        </div>
      )}

      <div className="btn-group">
        {preview && (
          <button
            className="btn primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Processing..." : "Extract Text"}
          </button>
        )}

        {text && (
          <>
            <button className="btn success" onClick={handleCopy}>
              Copy Text
            </button>
            <button className="btn danger" onClick={handleReset}>
              Start Over
            </button>
          </>
        )}
      </div>

      {copied && <div className="toast">Copied to clipboard</div>}

      {text && (
        <div className="output-card">
          <h2>Extracted Text</h2>
          <textarea value={text} readOnly />
        </div>
      )}
    </div>
  );
}
