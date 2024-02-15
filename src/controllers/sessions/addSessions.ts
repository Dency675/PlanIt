import { Request, Response } from "express";
import Session from "../../models/sessions";
import AWS from "aws-sdk";
import { Readable } from "stream";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";

interface SessionPostResponse {
  message: string;
  data: {
    newSession: Session;
    fileName: string;
  };
}
/**
 * Adds a new session to the database.
 *
 * @param {Request} req - Express Request object containing session data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response<SessionPostResponse>>} - A JSON response indicating the success or failure of the session creation operation.
 */

const s3 = new AWS.S3({
  accessKeyId: "AKIA5IOGN2NXNVX6UNHV",
  secretAccessKey: "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",
});

const addSessions = async (
  req: Request,
  res: Response
): Promise<Response<SessionPostResponse>> => {
  try {
    const {
      sessionTitle,
      createDateTime,
      timer,
      teamId,
      scrumMasterId,
      estimationId,
      calculationId,
    }: Session = req.body;

    if (
      !sessionTitle ||
      !createDateTime ||
      !teamId ||
      !scrumMasterId ||
      !estimationId ||
      !calculationId
    ) {
      return res
        .status(400)
        .send("data missing")
        .json({ message: "Missing required fields" });
    }

    const file = req?.file as Express.Multer.File;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: "ecommercebucket1",
      Key: file?.originalname,
      Body: Readable.from(file?.buffer),
      ContentType: file?.mimetype,
    };

    const s3UploadAsync = (
      params: AWS.S3.PutObjectRequest
    ): Promise<ManagedUpload.SendData> => {
      return new Promise((resolve, reject) => {
        s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    console.log("file is : ", req.file);
    console.log("file is : ", req.file?.originalname);
    let fileName = "";
    if (req.file) fileName = req.file.originalname;

    const excelLink = await s3UploadAsync(params);
    const newSession = await Session.create({
      sessionTitle: sessionTitle,
      createDateTime: createDateTime,
      timer,
      excelLink: excelLink.Location,
      teamId: teamId,
      scrumMasterId: scrumMasterId,
      estimationId: estimationId,
      calculationId: calculationId,
    });

    const data = {
      newSession: newSession,
      fileName: fileName,
    };

    const responseData: SessionPostResponse = {
      message: "Session created successfully",
      data: data,
    };

    console.log(responseData);
    return res.status(201).json({ responseData });
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default addSessions;
