import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";
import userStories from "../../models/userStories";

/**
 * Handles the upload of a csv file containing list of estimations in the Estimation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const uploadUserStories = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(422)
        .json({ error: "Invalid request, CSV file not provided" });
    }

    const csvData: any[] = [];
    const stream = fs.createReadStream(req.file.path);

    stream
      .pipe(csv())
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", async () => {
        try {
          if (csvData.length === 0) {
            return res
              .status(422)
              .json({ message: "No valid CSV records found" });
          }

          const userStory = csvData.map((record) => record.userStory);

          const existingUserStory = await userStories.findAll({
            where: {
              userStory: userStory,
            },
          });

          if (existingUserStory.length > 0) {
            return res
              .status(422)
              .json({ message: "Some CSV records already exist." });
          } else {
            const newUserStory = await userStories.bulkCreate(csvData);
            return res
              .status(201)
              .json({ message: "Added successfully", ...newUserStory });
          }
        } catch (error) {
          console.error(
            "Error during processing and database insertion:",
            error
          );
          return res.status(500).json({ error: "Internal server error" });
        } finally {
          fs.unlinkSync(req.file?.path || ""); 
        }
      });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during processing and database insertion:", error);
      res
        .status(500)
        .json({ error: "Internal server error", details: error.message });
    } else {
      console.error(
        "Unknown error during processing and database insertion:",
        error
      );
      res
        .status(500)
        .json({
          error: "Internal server error",
          details: "Unknown error occurred",
        });
    }
  }
};

export { uploadUserStories };
