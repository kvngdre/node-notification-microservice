import { Router } from "express";
import { container } from "tsyringe";
import { NotificationsController } from "@web/controllers/notifications-controller";

const router = Router();
const notificationController = container.resolve(NotificationsController);

router.post("/", notificationController.createNotification);
router.post("/send", notificationController.sendNotification);
router.get("/", notificationController.getNotifications);
router.get("/:notificationId", notificationController.getNotificationById);
router.delete("/:notificationId", notificationController.deleteNotificationById);

export const notificationsRouter = router;
