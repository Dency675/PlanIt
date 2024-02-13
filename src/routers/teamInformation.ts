import editTeamInformation from "../controllers/teamInformations/editTeamInformation.ts";
import getAllTeamInformation from "../controllers/teamInformations/getAllTeamInformation.ts";
import getATeamInformation from "../controllers/teamInformations/getATeamInformation.ts";
import addTeamInformation from "../controllers/teamInformations/postTeamInformation.ts";
import express from "express";
import { Request, Response } from "express";
import getTeamInformationByUserId from "../controllers/teamInformations/getTeamInformationByUserId.ts";

const teamInformationRouter = express.Router();

teamInformationRouter.post(
  "/addTeamInformation",
  async (req: Request, res: Response) => {
    addTeamInformation(req, res);
  }
);

teamInformationRouter.patch(
  "/editTeamInformation",
  async (req: Request, res: Response) => {
    editTeamInformation(req, res);
  }
);

teamInformationRouter.get(
  "/getAllTeamInformation",
  async (req: Request, res: Response) => {
    getAllTeamInformation(req, res);
  }
);
teamInformationRouter.get(
  "/getATeamInformation",
  async (req: Request, res: Response) => {
    getATeamInformation(req, res);
  }
);
teamInformationRouter.get(
  "/getTeamInformationByUserId",
  async (req: Request, res: Response) => {
    getTeamInformationByUserId(req, res);
  }
);

export default teamInformationRouter;
