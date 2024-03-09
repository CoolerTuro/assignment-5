import express from "express";
import { router as index } from "./api/index";
import bodyParser from "body-parser";


export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);