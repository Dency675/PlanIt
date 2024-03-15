import express from "express";
import { Request, Response } from "express";

import { jiraAuthentication } from "../controllers/jira/jiraAuthentication";
import { fetchProjectsFromJira } from "../controllers/jira/fetchProjectsFromJira";
import { getAllSprintsFromJira } from "../controllers/jira/getAllSprintsFromJira";
import { getAllIssuesFromJira } from "../controllers/jira/getAllIssuesFromJira";
import { postStoryPointToJira } from "../controllers/jira/postStoryPointToJira";
import { saveStoryPointToJira } from "../controllers/jira/saveStoryPointToJira";

const jiraRouter = express.Router();

jiraRouter.get("/auth/jira/:teamId", (req: Request, res: Response) => {
  jiraAuthentication(req, res);
});

jiraRouter.get("/auth/callback", (req: Request, res: Response) => {
  fetchProjectsFromJira(req, res);
});

jiraRouter.post("/getAllSprints", (req: Request, res: Response) => {
  getAllSprintsFromJira(req, res);
});

jiraRouter.get("/getAllIssues", (req: Request, res: Response) => {
  getAllIssuesFromJira(req, res);
});

jiraRouter.get("/postStoryPoint", (req: Request, res: Response) => {
  postStoryPointToJira(req, res);
});

jiraRouter.post("/auth/saveToJira", (req: Request, res: Response) => {
  saveStoryPointToJira(req, res);
});

export default jiraRouter;
