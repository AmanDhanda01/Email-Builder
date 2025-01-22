const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchEmailTemplate = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/getEmailLayout`);
    const template = await response.text();
    return template;
  } catch (e) {
    console.error("Error while fetching email templates: ", e);
    return { message: "error" };
  }
};

export const uploadImage = async (
  formData,
  setSelectedFile,
  templateConfig,
  id,
  setEditorType
) => {
  try {
    const response = await fetch(`${BACKEND_URL}/uploadImage`, {
      method: "POST",
      body: formData,
    });

    const resp = await response.json();

    if (response.ok) {
      alert("File uploaded successfully!");
      setSelectedFile(null);
      templateConfig[id] = resp.url;
      setEditorType("")
    } else {
      alert("Failed to upload file. Please try again.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading the file.");
  }
};

export const uploadEmailConfig = async (data,setEditorType) => {
  try {
    const response = await fetch(`${BACKEND_URL}/uploadEmailConfig`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensures the server recognizes JSON
        Accept: "application/json", // Optional but good practice
      },
      body: JSON.stringify(data),
    });

    const resp = await response.json();

    if (response.ok) {
      setEditorType("")
      await renderAndDownloadEmplate();
    } else {
      alert(resp.error);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading the email config.");
  }
};

export const renderAndDownloadEmplate = async () =>{
    try {
        const response = await fetch(`${BACKEND_URL}/renderAndDownloadTemplate`);
        if (!response.ok) {
            throw new Error("Failed to download file");
          }
      
          const blob = await response.blob(); // Convert response to a blob
          const url = window.URL.createObjectURL(blob); // Create a blob URL
          const link = document.createElement("a"); // Create a temporary <a> tag
          link.href = url;
          link.download = "customized-template.html"; // Specify the downloaded file name
          document.body.appendChild(link); // Add <a> to the document
          link.click(); // Simulate a click to trigger the download
          link.remove(); // Remove the <a> tag after the download starts
          window.URL.revokeObjectURL(url); // Clean up the blob URL
      } catch (e) {
        console.error("Error while fetching email templates: ", e);
        return { message: "error" };
      }
}
