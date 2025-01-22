import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { fetchEmailTemplate, renderAndDownloadEmplate, uploadEmailConfig } from "./api/email";
import TextEditor from "./TextEditor";
import ImageUpload from "./ImageUpload";

function App() {
  const [template, setTemplate] = useState("");
  const [editorType, setEditorType] = useState("");
  let [currentOutlinedElement, setCurrentOutlinedElement] = useState(null);
  const templateConfig = useRef({});

  console.log(templateConfig.current);

  useEffect(() => {
    async function fetchTemplate() {
      const response = await fetchEmailTemplate();
      setTemplate(response);
    }

    fetchTemplate();
  }, []);

  function handleClick(e) {
    if (currentOutlinedElement) {
      currentOutlinedElement.style.outline = "";
      currentOutlinedElement.style.outlineOffset = "";
      setEditorType("");
    }

    // Add yellow outline to the clicked element
    e.target.style.outline = "2px solid yellow";
    e.target.style.outlineOffset = "4px";

    // Update the current outlined element
    setCurrentOutlinedElement(e.target);
    // console.log("howa h",currentOutlinedElement.current)

    if (e.target.tagName === "IMG") {
      setEditorType("Image")
    }
    if (e.target.tagName === "TD") {
      
      setEditorType("Text");
    }
  }

  return (
    <div className="parentDiv">
      <div
        className="email"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: template }}
      ></div>
      <div className="editor">
        {editorType ? (
          <>
            {editorType === "Text" ? (
              <TextEditor currentOutlinedElement={currentOutlinedElement} templateConfig={templateConfig.current} setEditorType={setEditorType}  />
            ) : <ImageUpload currentOutlinedElement={currentOutlinedElement} templateConfig={templateConfig.current} setEditorType={setEditorType} />}
          </>
        ) : (
          <>
            <div className="message">
              {" "}
              Click on the element to start editing the template
            </div>
            <div class="editor-buttons">
              <button onClick={() =>uploadEmailConfig(templateConfig.current,setEditorType) } className="download-button">
                Download Template
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
