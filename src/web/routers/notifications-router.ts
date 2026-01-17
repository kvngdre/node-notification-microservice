import { Router } from "express";
import notificationController from "@web/controllers/notifications-controller";

const router = Router();

router.post("/", notificationController.createNotification);
router.post("/send", notificationController.sendNotification);
router.get("/", notificationController.getNotifications);
router.get("/:notificationId", notificationController.getNotificationById);
router.delete("/:notificationId", notificationController.deleteNotificationById);

export const notificationsRouter = router;
