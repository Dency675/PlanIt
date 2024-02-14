import { Request, Response } from 'express';
import Estimations from '../../models/estimations';

/**
 * Handles the delete of an estimation from the Estimation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const deleteEstimations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(422).json({error: "Missing Estimation ID "});
      return;
    }

    const deletedCount = await Estimations.destroy({
      where: { id: id }
    });

    if (deletedCount > 0) {
      res.status(201).json({ message: "Deleted successfully" });
    } else {
      res.status(500).json({ error: "Estimation not found" });
    }
  } catch(error){
    res.status(500).json({ message: "Internal Server Error" });
  }
};
