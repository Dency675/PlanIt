import { Request, Response } from "express";
import Estimations from "../../models/estimations";
import { Op } from "sequelize";

/**
 * Handles the retrieval of estimations in the Estimation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const getEstimationsByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { estimationName } = req.query;

    if (!estimationName) {
      res.status(422).json({ error: "Missing Estimation Name " });
      return;
    }

    const data = await Estimations.findOne({
      where: { estimationName: estimationName },
      raw: true,
    });

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

export const getEstimations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(422).json({ error: "Missing User ID in parameters" });
      return;
    }

    const data = await Estimations.findAll({
      where: {
        [Op.or]: [{ userId: userId }, { id: 1 }, { id: 2 }],
      },
      raw: true,
    });

    if (data) {
      res.status(200).json({ data });
    } else {
      res
        .status(404)
        .json({ error: "Data doesn't exist for the provided User ID" });
    }
  } catch (error) {
    console.log("Error in getEstimation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
