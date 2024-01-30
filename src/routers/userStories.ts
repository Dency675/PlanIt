import { Request, Response } from "express";
import express from "express";
import addUserStories from "../controllers/userStories/addUserStories";
import getAllUserStories from "../controllers/userStories/getAllUserStories";
import getUserStoryById from "../controllers/userStories/getUserStoryById";
import updateUserStory from "../controllers/userStories/updateUserStory";

const userStoriesRouter = express.Router();

userStoriesRouter.post(
  "/addUserStories",
  async (req: Request, res: Response) => {
    addUserStories(req, res);
  }
);

userStoriesRouter.get(
  "/getAllUserStories",
  async (req: Request, res: Response) => {
    getAllUserStories(req, res);
  }
);

userStoriesRouter.get(
  "/getUserStoryById",
  async (req: Request, res: Response) => {
    getUserStoryById(req, res);
  }
);

userStoriesRouter.patch(
  "/updateUserStory",
  async (req: Request, res: Response) => {
    updateUserStory(req, res);
  }
);

export default userStoriesRouter;
