import React, { useState, useEffect } from "react";
import "./TextEditor.css"; // Add this CSS file
import { uploadEmailConfig } from "./api/email";

const TextEditor = ({ currentOutlinedElement, templateConfig,setEditorType }) => {
  const [text, setText] = useState(currentOutlinedElement.innerText || "");
  const [alignment, setAlignment] = useState("center");
  const [font, setFont] = useState("Body font");
  const [textColor, setTextColor] = useState("#000");
  const [fontSize, setFontSize] = useState("md");
  const [textTransform, setTextTransform] = useState("none");

  // Initialize states based on the properties of currentOutlinedElement
  useEffect(() => {
    if (currentOutlinedElement) {
      const computedStyle = window.getComputedStyle(currentOutlinedElement);

      setText(currentOutlinedElement.innerText || "");
      setAlignment(computedStyle.textAlign || "center");
      setFont(
        computedStyle.fontFamily.includes("Georgia")
          ? "Heading font"
          : "Body font"
      );
      setTextColor(computedStyle.color || "#000");
      setFontSize(mapFontSizeReverse(computedStyle.fontSize));
      setTextTransform(computedStyle.textTransform || "none");
    }
  }, [currentOutlinedElement]);

  // Helper function to map font size from CSS to state
  const mapFontSizeReverse = (size) => {
    const sizeMap = {
      "10px": "xxs",
      "12px": "xs",
      "14px": "sm",
      "16px": "md",
      "20px": "lg",
      "24px": "xl",
      "30px": "xxl",
    };
    return sizeMap[size] || "Md";
  };

  // Helper function to map font size from state to CSS
  const mapFontSize = (size) => {
    const sizeMap = {
      xxs: "10px",
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "20px",
      xl: "24px",
      xxl: "30px",
    };
    return sizeMap[size] || "16px";
  };

  // Update the properties of currentOutlinedElement
  useEffect(() => {
    if (currentOutlinedElement) {
      currentOutlinedElement.style.textAlign = alignment;
      currentOutlinedElement.style.fontFamily =
        font === "Body font" ? "Arial, sans-serif" : "Georgia, serif";
      currentOutlinedElement.style.color = textColor;
      currentOutlinedElement.style.fontSize = mapFontSize(fontSize);
      currentOutlinedElement.style.textTransform = textTransform;
      currentOutlinedElement.innerText = text;
      const elementId = currentOutlinedElement.id;
      const config = {
        text,
        alignment,
        font: font === "Body font" ? "Arial, sans-serif" : "Georgia, serif",
        textColor,
        fontSize: mapFontSize(fontSize),
        textTransform,
      };

      templateConfig[elementId] = config;
    }
  }, [
    alignment,
    font,
    textColor,
    fontSize,
    textTransform,
    text,
    currentOutlinedElement,
  ]);

  return (
    <div className="text-editor">
      <h1 className="editor-title">Text Editor</h1>

      {/* Text Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
        className="editor-textarea"
        rows="3"
      />
      {/* Alignment */}
      <div className="editor-section">
        <label>Alignment</label>
        <div className="editor-buttons">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => setAlignment(align)}
              className={`editor-button ${alignment === align ? "active" : ""}`}
            >
              {align.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="editor-section">
        <label>Font</label>
        <div className="editor-buttons">
          {["Body font", "Heading font"].map((fontOption) => (
            <button
              key={fontOption}
              onClick={() => setFont(fontOption)}
              className={`editor-button ${font === fontOption ? "active" : ""}`}
            >
              {fontOption}
            </button>
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div className="editor-section">
        <label>Text Color</label>
        <div className="color-buttons">
          {["#000", "#444", "#00f", "#007bff"].map((color) => (
            <button
              key={color}
              onClick={() => setTextColor(color)}
              style={{ backgroundColor: color }}
              className={`color-button ${
                textColor === color ? "active-color" : ""
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="editor-section">
        <label>Font Size</label>
        <div className="editor-buttons">
          {["xxs", "xs", "sm", "md", "lg", "xl", "xxl"].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`editor-button ${fontSize === size ? "active" : ""}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Text Transform */}
      <div className="editor-section">
        <label>Text Transform</label>
        <div className="editor-buttons">
          {["none", "uppercase", "lowercase"].map((transform) => (
            <button
              key={transform}
              onClick={() => setTextTransform(transform)}
              className={`editor-button ${
                textTransform === transform ? "active" : ""
              }`}
            >
              {transform === "none"
                ? "Aa"
                : transform.charAt(0).toUpperCase() + transform.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div class="editor-buttons">
        <button
          onClick={() => setEditorType("")}
          className="save-button"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
