import express from "express";
import { Request, Response } from "express";
import addUserStorySessionMapping from "../controllers/userStorySessionMapping/addUserStorySessionMapping";
import getUserStoryCountsBySession from "../controllers/userStorySessionMapping/getUserStoryCount";
import getAllUserStoriesBySessionId from "../controllers/userStories/getAllUserStoriesBySessionId";

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

userStorySesssionMappingRouter.get(
  "/getAllUserStoriesBySessionId",
  async (req: Request, res: Response) => {
    getAllUserStoriesBySessionId(req, res);
  }
);

export default userStorySesssionMappingRouter;
