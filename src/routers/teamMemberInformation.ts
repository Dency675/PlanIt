import express, { Request, Response, Router } from "express";
import addTeamMemberInformation from "../controllers/teamMemberInformation/postTeamMemberInformation";
import getActiveTeamMembers from "../controllers/teamMemberInformation/getTeamMembersInformation";
import removeTeamMember from "../controllers/teamMemberInformation/removeTeamMemberinformation";
import { uploadTeamMembers } from "../controllers/teamMemberInformation/uploadTeamMember";
import assignNewScrumMaster from "../controllers/roles/assignNewScrumMaster";
import multer from "multer";
import addMultipleMembers from "../controllers/teamMemberInformation/addMultipleMembers";
import getTeamMemberInformationByUserId from "../controllers/teamMemberInformation/getTeamMemberInformationByUserId";

const upload = multer({ dest: "uploads/" });

const teamMemberInformationRouter: Router = express.Router();
teamMemberInformationRouter.post(
  "/addMember",
  async (req: Request, res: Response) => {
    addTeamMemberInformation(req, res);
  }
);

teamMemberInformationRouter.post(
  "/addMultipleMembers",
  async (req: Request, res: Response) => {
    addMultipleMembers(req, res);
  }
);

teamMemberInformationRouter.get(
  "/getMembers",
  async (req: Request, res: Response) => {
    getActiveTeamMembers(req, res);
  }
);
teamMemberInformationRouter.get(
  "/getTeamMemberInformationByUserId",
  async (req: Request, res: Response) => {
    getTeamMemberInformationByUserId(req, res);
  }
);
teamMemberInformationRouter.put(
  "/removeMember",
  async (req: Request, res: Response) => {
    removeTeamMember(req, res);
  }
);

teamMemberInformationRouter.post(
  "/uploadMember",
  upload.single("csvFile"),
  async (req: Request, res: Response) => {
    uploadTeamMembers(req, res);
  }
);

teamMemberInformationRouter.put(
  "/assignNewScrumMaster",
  async (req: Request, res: Response) => {
    assignNewScrumMaster(req, res);
  }
);

export default teamMemberInformationRouter;
