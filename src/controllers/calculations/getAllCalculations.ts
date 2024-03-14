import { Request, Response } from "express";
import calculations from "../../models/calculations";

/**
 * Handles the retrival of calculation method.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */

export const getAllCalculations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await calculations.findAll({ raw: true });

    if (data) {
      res.status(201).json({ ...data });
    } else {
      res.status(500).json({ error: "Data Doesnt exist" });
    }
  } catch (error) {
    console.log("Error in getEstimation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getAllCalculations;
