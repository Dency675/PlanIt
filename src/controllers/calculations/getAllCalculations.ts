import { Request, Response } from "express";
import calculations from "../../models/calculations";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Handles the retrieval of calculation methods.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const getAllCalculations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await calculations.findAll({ raw: true });

    if (data) {
      success(res, 201, { ...data });
    } else {
      failure(res, 500, null, "Data Doesn't exist");
    }
  } catch (error) {
    console.log("Error in getEstimation", error);
    failure(res, 500, null, "Internal Server Error");
  }
};

export default getAllCalculations;
