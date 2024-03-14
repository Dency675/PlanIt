import { Request, Response } from "express";
import Estimations from "../../models/estimations";

export const postEstimations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { estimationName, userId } = req.body;

    if (!estimationName || !userId) {
      res.status(422).json({ error: "Missing Estimation Name or User ID" });
      return;
    }

    const createdEstimation = await Estimations.create({
      estimationName: estimationName,
      userId: userId, // Include the userId in the creation process
    });

    if (createdEstimation) {
      const { id } = createdEstimation;
      res.status(201).json({ message: "Inserted", id: id });
    } else {
      res.status(500).json({ error: "Failed to insert data" });
    }
  } catch (error) {
    console.log("Error in postEstimation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
