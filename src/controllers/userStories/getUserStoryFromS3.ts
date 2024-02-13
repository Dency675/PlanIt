// getS3Data.ts
import { Request, Response } from "express";
import AWS from "aws-sdk";
import csvParser from "csv-parser";

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: "AKIA5IOGN2NXNVX6UNHV",
  secretAccessKey: "IIz6lpY6B5IVOW4wv9XSSvRmtzUCxf1HyfhoRBJv",
  region: "ap-south-1",
});

// Create an S3 instance
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
