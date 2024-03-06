import { Request, Response } from "express";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
import Notification from "../../models/notification";

const notificationsToBeDisplayed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return failure(res, 400, null, "Bad Request - Invalid userId");
    }
    const notifications = await Notification.findAll({
      where: {
        userId,
        status: true,
      },
    });
    return success(
      res,
      200,
      notifications,
      "Notifications fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return failure(res, 500, null, "Internal Server Error");
  }
};

export default notificationsToBeDisplayed;
