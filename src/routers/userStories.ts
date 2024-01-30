import addUserStories from "../controllers/userStories/addUserStories";
import express from "express";
import { Request, Response } from "express";

const userStoriesRouter = express.Router();

userStoriesRouter.post(
  "/addUserStories",
  async (req: Request, res: Response) => {
    addUserStories(req, res);
  }
);

export default userStoriesRouter;
