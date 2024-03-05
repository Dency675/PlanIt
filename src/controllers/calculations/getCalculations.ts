import { Request, Response } from "express";
import calculations from "../../models/calculations";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Handles the retrieval of a calculation method by ID.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const getCalculations = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      failure(res, 400, null, "ID not provided");
      return;
    }

    const found = await calculations.findOne({
      where: { id: id },
    });

    if (found) {
      success(res, 200, {
        message: "Data retrieved successfully",
        data: found,
      });
    } else {
      failure(res, 404, null, "Data not found");
    }
  } catch (error) {
    console.error("Error in calculationsGet:", error);
    failure(res, 500, null, "Internal Server Error");
  }
};

export default getCalculations;
