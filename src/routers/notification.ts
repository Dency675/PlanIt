import express from "express";
import { Request, Response } from "express";
import addNotification from "../controllers/notification/addNotification";
import notificationClosed from "../controllers/notification/notificationClosed";
import notificationIsRead from "../controllers/notification/notificationIsRead";
import notificationsToBeDisplayed from "../controllers/notification/notificationsToBeDisplayed";

const notificationRouter = express.Router();

notificationRouter.post(
  "/notification",
  async (req: Request, res: Response) => {
    addNotification(req, res);
  }
);

notificationRouter.patch(
  "/notification/:id",
  async (req: Request, res: Response) => {
    notificationClosed(req, res);
  }
);
notificationRouter.patch(
  "/notification/:notificationId/isRead",
  async (req: Request, res: Response) => {
    notificationIsRead(req, res);
  }
);

notificationRouter.get(
  "/notification/:userId",
  async (req: Request, res: Response) => {
    notificationsToBeDisplayed(req, res);
  }
);

export default notificationRouter;
