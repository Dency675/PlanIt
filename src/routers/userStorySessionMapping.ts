import express from "express";
import { Request, Response } from "express";
import addUserStorySessionMapping from "../controllers/userStorySessionMapping/addUserStorySessionMapping";
import getUserStoryCountsBySession from "../controllers/userStorySessionMapping/getUserStoryCount";

const userStorySesssionMappingRouter = express.Router();

userStorySesssionMappingRouter.post(
  "/addUserStorySessionMapping",
  async (req: Request, res: Response) => {
    addUserStorySessionMapping(req, res);
  }
);
userStorySesssionMappingRouter.get(
  "/getStoryCount",
  async (req: Request, res: Response) => {
    getUserStoryCountsBySession(req, res);
  }
);

export default userStorySesssionMappingRouter;

