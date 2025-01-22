import React, { useState } from "react";
import "./ImageUpload.css";
import { uploadImage } from "./api/email";

const ImageUpload = ({ currentOutlinedElement,templateConfig,setEditorType }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => (currentOutlinedElement.src = reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload to the backend
  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select a file before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    await uploadImage(formData,setSelectedFile,templateConfig,currentOutlinedElement.id,setEditorType);

  };

  return (
    <div className="image-upload-container">
      <h2 className="title">Upload Your Image</h2>

      <div className="input-group">
        <label htmlFor="file-input" className="file-label">
          Choose Image
        </label>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      <button onClick={handleSave} className="save-button">
        Save
      </button>
    </div>
  );
};

export default ImageUpload;
