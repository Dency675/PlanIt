import { Request, Response } from 'express';
import Estimations from '../../models/estimations';

/**
 * Handles the update of an estimation in the Estimation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const putEstimations = async(req: Request, res: Response):Promise<void> => {

try{
    const { id,estimation_name } = req.body;
    
    if (!id||!estimation_name) {
      res.status(422).json({error: "Missing Values "});
      return;
    }
   
    const found = await Estimations.update(
          {
            estimation_name:estimation_name,
          } 
          , { where: { id: id}}
        );

        if (found) {
          res.status(201).json({ message: "Inserted" });
        } else {
          res.status(500).json({ error: "Failed to insert data" });
        }

        }catch(error){
          console.log("Error in putEstimation",error);
          res.status(500).json({ message: "Internal Server Error" });
        }

    }

