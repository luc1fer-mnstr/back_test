const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  keyFile: "react-sheet-465214-2536c6c0b1be.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.get("/", (req, res) => {
  res.send("✅ Backend is connected!");
});

app.post("/submit", async (req, res) => {
  const { name, studentId, grade } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1DtIHN2nYkDhkZ5vZTPoKaNS9wfPcLhVcEvdy3wx7nQ8";
    const range = "Sheet1!A:C";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, studentId, grade]],
      },
    });

    res.status(200).json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error writing to sheet:", error);
    res.status(500).json({ message: "Failed to write data" });
  }
});

app.get("/test-json", (req, res) => {
  const fs = require("fs");
  try {
    const key = fs.readFileSync("react-sheet-465214-2536c6c0b1be.json", "utf8");
    res.status(200).send("✅ JSON file loaded successfully");
  } catch (error) {
    res.status(500).send("❌ Cannot read JSON file");
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
