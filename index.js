const express = require("express");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const port = 3300;

dotenv.config();

const REACT_APP_PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:" + REACT_APP_PORT,
        methods: "GET,POST,PUT,DELETE,PATCH",
        allowedHeaders: "*",
    })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/post", postRoutes);

app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
