import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import User from "./user.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import Post from "./Post.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import env from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadMiddleware = multer({ dest: "uploads/" });
const app = express();
const port = 3000;
env.config();

const saltRounds = 10;
const secret = process.env.SECRET;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "mongodb+srv://dipeshp16:xj4gg5zIKD70oQ7D@cluster0.lkcfv3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.post("/sign", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, saltRounds),
    });
    res.json(userDoc);
    console.log(req.body);
    next();
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/log", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passRyt = bcrypt.compareSync(password, userDoc.password);

  if (passRyt) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;

      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
      console.log(token);
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    try {
      if (err) throw err;
      res.json(info);
    } catch (err) {
      console.log("not log in yet or error");
    }
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  const postDoc = await Post.findById(id).populate("author", ["username"]);
  if (!postDoc) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(postDoc);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
