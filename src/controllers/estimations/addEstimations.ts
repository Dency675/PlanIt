import { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import Estimations from '../../models/estimations';
 
/**
 * Handles the upload of a csv file containing list of estimations in the Estimation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const uploadEstimations = async (req: Request, res: Response) => {
  try {
    console.log(req.file)
    if (!req.file) {
      return res.status(422).json({ error: 'Invalid request, CSV file not provided' });
    }
 
    const csvData: any[] = [];
    const stream = fs.createReadStream(req.file.path);
   
    stream
      .pipe(csv())
      .on('data', (row) => {
          csvData.push(row);
      })
    .on('end', async () => {
        try {
          if (csvData.length === 0) {
            return res.status(422).json({ message: 'No valid CSV records found' });
          }
     
          const estimationName = csvData.map((record) => record.estimationName);
     
          // Check for existing estimations
          const existingEstimations = await Estimations.findAll({
            where: {
                estimationName: estimationName,
            },
          });
     
          if (existingEstimations.length > 0) {
            return res.status(422).json({ message: 'Some CSV records already exist.' });
          }
          else {
            const newEstimation = await Estimations.bulkCreate(csvData);
            return res.status(201).json({ message: 'Added successfully',  ...newEstimation,});
          }
        }
        catch (error) {
          console.error('Error during processing and database insertion:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        finally {
          // Cleanup: Remove the uploaded file after processing
          fs.unlinkSync(req.file?.path || ''); // Using optional chaining and nullish coalescing
        }
      });
  }  
  catch (error) {
    if (error instanceof Error) {
      console.error('Error during processing and database insertion:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
    else {
      console.error('Unknown error during processing and database insertion:', error);
      res.status(500).json({ error: 'Internal server error', details: 'Unknown error occurred' });
    }
  }
};
 
export { uploadEstimations };