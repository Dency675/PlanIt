import { Request, Response } from "express";
import Scales from "../../models/scales";
import Estimations from "../../models/estimations";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Handles the retrieval of a scale in the Scale model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const getScalesByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { estimationId } = req.params;

    if (!estimationId) {
      return failure(res, 422, null, "Missing Values");
    }

    const data = await Scales.findAll({
      where: { estimationId: estimationId },
      include: [
        {
          model: Estimations,
          attributes: [],
        },
      ],
      attributes: ["scaleName", "scaleValue"],
      raw: true,
    });

    if (data && data.length > 0) {
      const formattedData = data.map((item) => ({
        scaleName: item.scaleName,
        scaleValue: item.scaleValue,
      }));

      formattedData.push({ scaleName: "?", scaleValue: -1 });

      return success(res, 201, formattedData, "Scale Found");
    } else {
      return failure(res, 404, null, "Data Doesnt exist");
    }
  } catch (error) {
    return failure(res, 500, null, "Internal server error!");
  }
};
