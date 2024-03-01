import { Request, Response } from "express";
import HttpStatus from "http-status";

function failure(
  res: Response,
  statusCode: number = HttpStatus.BAD_REQUEST,
  data?: any,
  message: string = ""
): void {
  res
    .status(statusCode)
    .send({
      message,
      data,
    })
    .end();
}

export { failure };
