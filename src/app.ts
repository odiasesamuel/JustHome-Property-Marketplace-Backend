import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";

const app = express();

// app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, TypeScript with Express!" });
});

export default app;
