import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

const decodeTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ error: "unauthorized - token not provided" });
    }
    const processedToken = token.split("Bearer ")[1];

    const decodedToken = jwt.decode(processedToken, { complete: true });

    if (decodedToken && ((decodedToken as Jwt)?.payload as JwtPayload).exp) {
      let expriry = ((decodedToken as Jwt)?.payload as JwtPayload)?.exp;
      const currentTimeStamp = Math.floor(Date.now() / 1000);
      const isTokenExpried = expriry && expriry < currentTimeStamp;

      if (isTokenExpried) {
        throw new Error("Token Expired error");
      } else {
        next();
      }
    } else {
      console.error("Invalid token structure");
      res.locals.decodedToken = decodedToken;
      throw new Error("InvalidTokenStructureError");
    }
  } catch (err) {
    console.error("Error: ", err);
    return res.status(403).json({
      success: false,
      error: "Forbidden - Token has expired or invalid",
    });
  }
};

export default decodeTokens;
