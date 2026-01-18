import { Router } from "express";
import container from "../../di-container";
import NotificationsController from "@web/controllers/notifications-controller";

const router = Router();

// Resolve controller from DI container
const getController = () => container.get(NotificationsController);

router.post("/", (req, res) => getController().createNotification(req, res));
router.post("/send", (req, res) => getController().sendNotification(req, res));
router.get("/", (req, res) => getController().getNotifications(req, res));
router.get("/:notificationId", (req, res) => getController().getNotificationById(req, res));
router.delete("/:notificationId", (req, res) => getController().deleteNotificationById(req, res));

export default router;
