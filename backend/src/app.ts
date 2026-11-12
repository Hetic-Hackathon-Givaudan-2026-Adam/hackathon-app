import cors from "cors";
import express from "express";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errors";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
