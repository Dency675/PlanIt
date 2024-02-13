import { Request, Response } from "express";
import Scales from "../../models/scales";
import Estimations from "../../models/estimations";

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
    const { estimationId } = req.query;

    if (!estimationId) {
      res.status(422).json({ error: "Missing Values " });
      return;
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

      res.status(201).json({ formattedData });
    } else {
      res.status(404).json({ error: "Data Doesnt exist" });
    }
  } catch (error) {
    console.log("Error in getScales", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
