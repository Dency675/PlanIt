import { Request, Response } from "express";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
import Notification from "../../models/notification";

const notificationClosed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return failure(res, 400, null, "Bad Request - Invalid notificationId");
    }
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return failure(res, 404, null, "Notification not found");
    }
    await notification.update({ status: false });
    return success(res, 200, notification, "Notification Closed");
  } catch (error) {
    console.error("Error toggling notification status:", error);
    return failure(res, 500, null, "Internal Server Error");
  }
};

export default notificationClosed;
