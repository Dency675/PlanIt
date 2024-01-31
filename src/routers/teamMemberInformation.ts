import express, { Request, Response, Router } from "express";
import addTeamMemberInformation from "../controllers/teamMemberInformation/postTeamMemberInformation";
import getActiveTeamMembers from "../controllers/teamMemberInformation/getTeamMembersInformation";
import removeTeamMember from "../controllers/teamMemberInformation/removeTeamMemberinformation";


const teamMemberInformationRouter: Router = express.Router();
teamMemberInformationRouter.post(
  "/addMember",
  async (req: Request, res: Response) => {
    addTeamMemberInformation(req, res);
  }     
);          
teamMemberInformationRouter.get(
    "/getMembers",
    async (req: Request, res: Response) => {
        getActiveTeamMembers(req, res);
    }
  );
  teamMemberInformationRouter.put(
    "/removeMember",
    async (req: Request, res: Response) => {
      removeTeamMember(req, res);
    }
  );
export default teamMemberInformationRouter;

