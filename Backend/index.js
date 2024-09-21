const express = require("express");
const multer = require("multer");
const cors = require("cors")

const docxToPdf = require("docx-pdf");
const path = require("path");
const { log } = require("console");

const app = express();
const port = 3000;

app.use(cors())

// storing the file in the uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/convertFile", upload.single("file"), function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "No file Uploaded" });
    }

    // defining the converted file path (output path)
    let outputPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`
    ); // create the files folder

    docxToPdf(req.file.path, outputPath, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error convert docx to pdf" });
      }

      res.download(outputPath, () => {
        console.log("file downloaded");
        
      })

    });
  } catch (error) {
    console.log(error);
    res.status(502).json({message: "Internal server error"})
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
