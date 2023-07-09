const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", upload.single("file"), async (req, res) => {
    try {
        const configuration = new Configuration({
            apiKey: "",
        });
        const openai = new OpenAIApi(configuration);
        const resp = await openai.createTranscription(
            fs.createReadStream(req.file.path),
            "whisper-1"
        );
        res.render("result", { response: resp.data.text });
    } catch (error) {
        console.error(error);
        res.render("error");
    }
});

app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server started on port 3000");
});