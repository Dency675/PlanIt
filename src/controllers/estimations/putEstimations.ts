import { Request, Response } from "express";
import Estimations from "../../models/estimations";
import { failure } from "D:/PlanIt/src/helper/statusHandler/failureFunction";
import { success } from "D:/PlanIt/src/helper/statusHandler/successFunction";

/**
 * Handles the update of an estimation in the Estimation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const putEstimations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, estimationName } = req.body;

    if (!id || !estimationName) {
      return failure(res, 422, null, "Missing Values");
    }

    const found = await Estimations.update(
      { estimationName },
      { where: { id } }
    );

    if (found) {
      return success(res, 201, { message: "Updated successfully" });
    } else {
      return failure(res, 500, null, "Failed to update data");
    }
  } catch (error) {
    console.error("Error in putEstimation", error);
    return failure(res, 500, null, "Internal Server Error");
  }
};
