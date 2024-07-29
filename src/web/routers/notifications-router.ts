import { Router } from "express";
import { container } from "tsyringe";
import { NotificationsController } from "@web/controllers/notification-controller";

const router = Router();
const notificationController = container.resolve(NotificationsController);

router.post("/", notificationController.createNotification);

export const notificationsRouter = router;
