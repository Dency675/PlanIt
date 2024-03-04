import { Request, Response } from "express";
import Scales from "../../models/scales";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Handles the creation of a scale in the Scale model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const postScales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { estimationId, scaleName, scaleValue } = req.body;

    if (!scaleName || !estimationId || !scaleValue) {
      return failure(res, 422, null, "Missing Values");
    }

    const found = await Scales.create({
      estimationId: estimationId,
      scaleName: scaleName,
      scaleValue: scaleValue,
    });

    if (found) {
      return success(res, 201, null, "Scale Created");
    } else {
      return failure(res, 500, null, "Failed to insert data");
    }
  } catch (error) {
    return failure(res, 500, null, "Internal server error!");
  }
};
