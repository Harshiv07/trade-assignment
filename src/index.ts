import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { setupSwagger } from "./swagger";
import { setupRoutes } from "./routes";

export const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

setupSwagger(app);
setupRoutes(app);

app.listen(3000, () => console.log("Server running on port 3000"));
