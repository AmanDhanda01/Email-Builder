require("dotenv").config();

const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { JSDOM } = require("jsdom");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, "images")));
app.use(express.json());

app.use(cors());

app.get("/getEmailLayout", (req, res) => {
  res.sendFile(path.join(__dirname, "templates/first.html"));
});

app.post("/uploadImage", upload.any(), (req, res) => {
  if (req.files.length > 0) {
    res.status(200).json({
      success: true,
      message: "Image(s) uploaded successfully!",
      url: `${process.env.LIVE_URL}/${req.files[0].originalname}`,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "No files were uploaded. Please try again.",
    });
  }
});

app.post("/uploadEmailConfig", (req, res) => {
  try {
    const emailConfig = req.body; // Fetch JSON data from the request body

    // Validate the input data
    if (!emailConfig || typeof emailConfig !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid email configuration data provided.",
      });
    }

    // Path to the config file
    const configPath = path.join(__dirname, "/data/emailConfig.json");

    // Convert the JSON object into a formatted string
    const fileContent = JSON.stringify(emailConfig, null, 4);

    // Write the JSON to a file
    fs.writeFile(configPath, fileContent, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to save email configuration.",
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Email configuration file successfully saved.",
        filePath: configPath, // Optional: Return the file path
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
      error: error.message,
    });
  }
});

app.get("/renderAndDownloadTemplate", (req, res) => {
  const emailConfigPath = path.join(__dirname, "data/emailConfig.json");
  const htmlTemplatePath = path.join(__dirname, "templates/first.html");
  const outputPath = path.join(__dirname, "output/renderedTemplate.html");

  // Read email configuration
  fs.readFile(emailConfigPath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).json({
        success: false,
        message: "Email Configuration not found.",
      });
    }

    const emailData = JSON.parse(data);

    // Read the HTML template
    fs.readFile(htmlTemplatePath, "utf8", (err, htmlTemplate) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Template file not found.",
        });
      }

      const dom = new JSDOM(htmlTemplate);
      const document = dom.window.document;

      Object.keys(emailData).forEach((id) => {
        const elementData = emailData[id];
        const element = document.getElementById(id);

        if (element) {
          if (typeof elementData === "object") {
            // Apply styles to the element
            element.style.textAlign = elementData.alignment || "inherit";
            element.style.fontFamily = elementData.font || "inherit";
            element.style.color = elementData.textColor || "inherit";
            element.style.fontSize = elementData.fontSize || "inherit";
            element.style.textTransform =
              elementData.textTransform || "inherit";

            // Replace the inner text
            element.textContent = elementData.text || "";
          } else if (typeof elementData === "string") {
            // Update the `src` attribute for image elements
            if (element.tagName.toLowerCase() === "img") {
              element.setAttribute("src", elementData);
            }
          }
        }
      });

      // Serialize the updated DOM back to HTML
      htmlTemplate = dom.serialize();

      // Save the updated template
      fs.writeFile(outputPath, htmlTemplate, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Failed to save the rendered template.",
          });
        }

        res.download(outputPath, "customized-template.html", (downloadErr) => {
          if (downloadErr) {
            return res.status(500).json({
              success: false,
              message: "Failed to download the rendered template.",
            });
          }
        });
      });
    });
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running");
});
