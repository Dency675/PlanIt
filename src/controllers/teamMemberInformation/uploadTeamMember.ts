import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";
import TeamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";

/**
 * Handles the upload of a CSV file containing a list of team members in the TeamMemberInformation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */
const uploadTeamMembers = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.query;

    console.log(req.file);
    if (!req.file) {
      return res
        .status(422)
        .json({ error: "Invalid request, CSV file not provided" });
    }

    const csvData: any[] = [];
    const stream = fs.createReadStream(req.file.path);

    stream
      .pipe(csv())
      .on("data", async (row) => {
        // Ensure that each CSV record includes userId, teamId, roleId, and status
        if (!row.userId) {
          console.error("Invalid CSV record:", row);
          return res.status(422).json({ message: "Invalid CSV records found" });
        }

        const isUserActive = await userInformation.findOne({
          where: {
            id: row.userId,
            status: "active",
          },
        });

        if (!isUserActive) {
          res.status(400).json({
            error: "User is not active",
          });
          return;
        }

        csvData.push({
          userId: row.userId,
          teamId: teamId,
          roleId: 1,
          status: "active",
        });
      })
      .on("end", async () => {
        console.log(csvData);
        try {
          //   if (csvData.length === 0) {
          //     return res
          //       .status(422)
          //       .json({ message: "No valid CSV records found" });
          //   }

          const userIds = csvData.map((record) => record.userId);

          // Check for existing team members
          const existingTeamMembers = await TeamMemberInformation.findAll({
            where: {
              userId: userIds,
            },
          });

          if (existingTeamMembers.length > 0) {
            return res.status(422).json({
              message: "Some CSV records already exist as team members.",
            });
          } else {
            const newTeamMembers = await TeamMemberInformation.bulkCreate(
              csvData
            );
            return res.status(201).json({
              message: "Team members added successfully",
              newTeamMembers,
            });
          }
        } catch (error) {
          console.error(
            "Error during processing and database insertion:",
            error
          );
          return res.status(500).json({ error: "Internal server error" });
        } finally {
          // Cleanup: Remove the uploaded file after processing
          fs.unlinkSync(req.file?.path || ""); // Using optional chaining and nullish coalescing
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
      res.status(500).json({
        error: "Internal server error",
        details: "Unknown error occurred",
      });
    }
  }
};

export { uploadTeamMembers };
