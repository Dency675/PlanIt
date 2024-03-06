import { Request, Response } from "express";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
import Notification from "../../models/notification";

const notificationIsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.notificationId, 10);
    if (isNaN(userId)) {
      return failure(res, 400, null, "Bad Request - Invalid userId");
    }

    const notificationsToUpdate = await Notification.findAll({
      where: {
        userId,
        status: true,
        isRead: false,
      },
    });

    for (const notification of notificationsToUpdate) {
      await notification.update({ isRead: true });
    }

    return success(
      res,
      200,
      notificationsToUpdate,
      "Notifications isRead status toggled successfully"
    );
  } catch (error) {
    console.error("Error toggling notification isRead:", error);
    return failure(res, 500, null, "Internal Server Error");
  }
};

export default notificationIsRead;
