import { Request, Response } from "express";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
import Notification from "../../models/notification";

const addNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, context, prop } = req.body;
    if (!userId || !context || !prop) {
      return failure(res, 400, null, "Bad Request - Missing required fields");
    }
    const notification = await Notification.create({
      userId,
      context,
      prop,
    });
    return success(res, 201, notification, "Notification created successfully");
  } catch (error) {
    console.error("Error creating notification:", error);
    return failure(res, 500, null, "Internal Server Error");
  }
};

export default addNotification;
