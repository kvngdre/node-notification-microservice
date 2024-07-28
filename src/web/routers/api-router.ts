import { type Request, type Response, Router } from "express";

export const apiRouter = Router();

apiRouter.all("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});
