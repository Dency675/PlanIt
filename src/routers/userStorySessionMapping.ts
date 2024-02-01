import express from "express";
import { Request, Response } from "express";
import addUserStorySessionMapping from "../controllers/userStorySessionMapping/addUserStorySessionMapping";

const userStorySesssionMappingRouter = express.Router();

userStorySesssionMappingRouter.post(
  "/addUserStorySessionMapping",
  async (req: Request, res: Response) => {
    addUserStorySessionMapping(req, res);
  }
);

export default userStorySesssionMappingRouter;
