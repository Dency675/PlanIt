import { Request, Response } from "express";
import calculations from "../../models/calculations";

/**
 * Handles the retrival of calculation method.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */

const getCalculations = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({
        message: "ID not provided",
      });
      return;
    }

    const found = await calculations.findOne({
      where: { id: id },
    });
    if (found) {
      res.status(200).json({
        message: "Data retrieved successfully",
        data: found,
      });
    } else {
      res.status(404).json({
        message: "Data not found",
      });
    }
  } catch (error) {
    console.error("Error in calculationsGet:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default getCalculations;
