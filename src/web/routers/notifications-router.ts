import { Router } from "express";
import { NotificationsController } from "@web/controllers/notifications-controller";
import container from "src/di-container";

const router = Router();
const notificationController = container.get<NotificationsController>(NotificationsController);

router.post("/", notificationController.createNotification);
router.post("/send", notificationController.sendNotification);
router.get("/", notificationController.getNotifications);
router.get("/:notificationId", notificationController.getNotificationById);
router.delete("/:notificationId", notificationController.deleteNotificationById);

export const notificationsRouter = router;
