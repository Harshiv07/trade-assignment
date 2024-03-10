import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { setupSwagger } from "./swagger";
import { setupRoutes } from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(cors());

setupSwagger(app);
setupRoutes(app);

app.listen(process.env.PORT ?? 3000, () => console.log("Server running..."));

export default app;
