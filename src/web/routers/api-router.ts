import { type Request, type Response, Router } from "express";
import notificationsRouter from "./notifications-router.js";

export const router = Router();

router.all("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

router.use("/notifications", notificationsRouter);

export default router;
