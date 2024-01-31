import { Request, Response } from "express";
import Calculations from "../../models/calculations";

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
      res.status(400).json({
        error: "Calculation name not provided",
      });
      return;
    }

    const calculation = await Calculations.create({ calculationName });
    res.status(200).json({
      message: "Data inserted successfully",
      data: calculation.toJSON(), 
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export default addCalculations;
