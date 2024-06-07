const router = require("express").Router();
const jwt = require("jsonwebtoken");

const users = [];
let id = 1;

router.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            result: "error",
            username: username,
            message: "Username and password are required",
        });
        return;
    }
    if (users.find((user) => user.username === username)) {
        res.status(400).json({
            result: "error",
            username: username,
            message: "Username already exists",
        });
        return;
    }
    const newUser = {
        id: id.toString(),
        username,
        password,
    };
    console.log("register req", username, password, id);
    id += 1;
    users.push(newUser);
    res.json({
        result: "success",
        username: newUser.username,
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find((user) => {
        return user.username === username;
    });
    if (!user) {
        res.status(401).json({
            result: "error",
            username: username,
            userid: "",
            message: "Wrong username or password",
        });
        return;
    }
    if (user.password !== password) {
        res.status(401).json({
            result: "error",
            username: username,
            userid: "",
            message: "Wrong username or password",
        });
        return;
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.JWT_SECRET
    );

    res.json({
        result: "success",
        username: user.username,
        userid: user.id,
        token: accessToken,
        message: "",
    });
});

module.exports = router;
