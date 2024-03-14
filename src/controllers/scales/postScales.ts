import { Request, Response } from "express";
import Scales from "../../models/scales";

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
    const { estimationId, cardValues } = req.body;

    if (!estimationId || !cardValues || cardValues.length === 0) {
      res.status(422).json({ error: "Missing Values " });
      return;
    }

    // Assuming Scales model has fields 'estimationId', 'scaleName', and 'scaleValue'
    const scalesData = cardValues.map((scaleName: any, index: number) => ({
      estimationId: estimationId,
      scaleName: scaleName,
      scaleValue: index + 1, // Assuming scaleValue represents the order of the card
    }));

    const found = await Scales.bulkCreate(scalesData);

    if (found) {
      res.status(201).json({ message: "Inserted" });
    } else {
      res.status(500).json({ error: "Failed to insert data" });
    }
  } catch (error) {
    console.log("Error in postScales", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
