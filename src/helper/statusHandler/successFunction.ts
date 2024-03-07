import { Response } from "express";
import HttpStatus from "http-status";

function success(
  res: Response,
  statusCode: number = HttpStatus.OK,
  data?: any,
  message: string = ""
): void {
  res
    .status(statusCode)
    .json({
      message,
      data,
    })
    .end();
}

export { success, HttpStatus };
