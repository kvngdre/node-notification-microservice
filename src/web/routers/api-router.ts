import { type Request, type Response, Router } from "express";

export const router = Router();

router.all("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

export const apiRouter = router;
