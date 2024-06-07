const router = require("express").Router();
const jwt = require("jsonwebtoken");

/**
 *
 * posts
 * GET, POST, DELETE
 */

let gPostId = 1;

const posts = [
    {
        id: "0",
        content: "fisrt post",
        userId: "1",
    },
];

// router.get("/", (req, res) => {
//     res.send(posts);
// });

// router.post("/", (req, res) => {
//     const newPost = { ...req.body };
//     posts.push(newPost);
//     res.send(newPost);
// });

router.delete("/:id", authentication, (req, res) => {
    const { id } = req.params;
    const postId = id;

    const reqUser = req.user;
    const post = posts.find((post) => post.id === postId);

    if (!post) {
        res.status(400).send({ message: "Post does not exist" });
        return;
    }

    if (reqUser.id !== post.userId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
    }

    const index = posts.findIndex((post) => {
        return post.id === postId;
    });

    if (index != -1) {
        posts.splice(index, 1);
        res.send({ message: "Success" });
    }
});

// add a new post
router.post("/add", authentication, (req, res) => {
    const reqUser = req.user;
    const newPost = { ...req.body, userId: reqUser.id, id: gPostId.toString() };
    gPostId += 1;
    posts.push(newPost);
    res.send(newPost);
});

// update a post
router.patch("/:id", authentication, (req, res) => {
    const { id } = req.params;
    const postId = id;
    const reqUser = req.user;
    const post = posts.find((post) => post.id === postId);

    if (!post) {
        res.status(400).send({ message: "Post does not exist" });
        return;
    }

    if (reqUser.id !== post.userId) {
        res.status(401).send({ message: "update post Unauthorized" });
        return;
    }

    const index = posts.findIndex((post) => {
        return post.id === postId;
    });

    if (index != -1) {
        posts[index] = { ...posts[index], ...req.body };
        res.send(posts[index]);
    }
});

// get all posts from a user
router.get("/user/:userId", authentication, (req, res) => {
    const { userId } = req.params;
    const user = req.user;
    if (userId !== user.id) {
        res.status(401).send("wrong user");
        return;
    }
    const userPosts = posts.filter((post) => {
        return post.userId === user.id;
    });
    res.send(userPosts);
});

function authentication(req, res, next) {
    req.cookies;
    const authHeader = req.headers["authorization"];
    console.log(req.headers);
    const token = authHeader.split(" ")[1];

    if (token == null) {
        res.status(401).send("authentication error");
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(401).send("authentication error");
            return;
        }
        req.user = user;
        next();
    });
}

module.exports = router;
