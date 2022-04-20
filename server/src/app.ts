import * as express from "express";
import * as bodyParser from "body-parser";
import { auth } from "@/routes/auth";

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/auth", auth);

app.get("/welcome", function (req, res) {
  res.end("Hello World!");
});
