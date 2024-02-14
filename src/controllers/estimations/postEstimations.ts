import { Request, Response } from 'express';
import Estimations from '../../models/estimations';

/**
 * Handles the creation of a new estimation in the Estimations model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const postEstimations = async(req: Request, res: Response):Promise<void> => {

try{
    const { estimationName } = req.body;
   
    if (!estimationName) {
      res.status(422).json({error: "Missing Estimation Name "});
      return;
    }

    const found = await Estimations.create(
          {
            estimationName:estimationName,
          } 
        );

        if (found) {
            res.status(201).json({ message: "Inserted" });
          } else {
            res.status(500).json({ error: "Failed to insert data" });
          }

        }catch(error){
          res.status(500).json({ message: "Internal Server Error" });
        }

    }

