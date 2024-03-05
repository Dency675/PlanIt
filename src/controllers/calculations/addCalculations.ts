import { Request, Response } from "express";
import calculations from "../../models/calculations";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Handles the creation of a new calculation method in the calculations model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const addCalculations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { calculationName } = req.body;

    if (!calculationName) {
      failure(res, 400, null, "Calculation name not provided");
      return;
    }

    const calculation = await calculations.create({ calculationName });
    success(res, 200, {
      message: "Data inserted successfully",
      data: calculation.toJSON(),
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    failure(res, 500, null, "Server Error");
  }
};

export default addCalculations;
