import { Request, Response } from 'express';
import Scales from '../../models/scales';

/**
 * Handles the creation of a scale in the Scale model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

export const postScales = async(req: Request, res: Response):Promise<void> => {

try{
    const { estimation_id, scale_name, scale_value } = req.body;
   
    if (!scale_name||!estimation_id||!scale_value) {
        res.status(422).json({error: "Missing Values "});
        return;
      }

    const found = await Scales.create(
          {
            estimation_id:estimation_id,
            scale_name:scale_name, 
            scale_value:scale_value
          } 
        );
          
        if (found) {
          res.status(201).json({ message: "Inserted" });
        } else {
          res.status(500).json({ error: "Failed to insert data" });
        }

        }catch(error){
          console.log("Error in postScales",error);
          res.status(500).json({ message: "Internal Server Error" });
        }

    }

