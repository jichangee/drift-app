import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors'
import { errors } from "celebrate";
import { auth } from "@/routes/auth";
import { posts } from "@/routes/posts";

export const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/auth", auth);
app.use("/posts", posts);

app.use(errors());

app.get("/welcome", function (req, res) {
  res.end("Hello World!");
});
