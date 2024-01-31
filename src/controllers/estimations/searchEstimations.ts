import Estimations from '../../models/estimations';
import { Request, Response } from 'express';
import { Op } from "sequelize"; 

/**
 * Handles the search functionality of an estimation in the Estimation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const searchEstimations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { search } = req.query;

      if (!search) {
        res.status(422).json({error: "Missing Values "});
        return;
      }

      const results = await Estimations.findAll({
        where: {
          estimation_name: {
            [Op.like]: `%${search}%`,
          },
        },
      });
      
      res.status(200).json({ message: results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };