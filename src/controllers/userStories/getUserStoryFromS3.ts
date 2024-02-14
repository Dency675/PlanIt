import { Request, Response } from "express";
import AWS from "aws-sdk";
import csvParser from "csv-parser";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const getS3Data = (req: Request, res: Response): Promise<any> => {
  return new Promise((resolve, reject) => {
    const bucketName = "ecommercebucket1";
    const key = "userStories - Sheet2.csv";

    const params = { Bucket: bucketName, Key: key };
    const s3Data = s3.getObject(params).createReadStream();

    const csvData: any[] = [];

    s3Data
      .pipe(csvParser())
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", () => {
        resolve({ data: csvData });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export default getS3Data;
