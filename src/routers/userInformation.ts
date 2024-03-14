import express, { Request, Response, Router } from "express";
import postUserInformation from "../controllers/userInformation/postUserInformation";
import getUser from "../controllers/userInformation/getUserInformation";
import putUserInformation from "../controllers/userInformation/putUserInformation";
import addEmployeeRole from "../controllers/employeeRoleMapping/addEmployeeRole";
import editEmployeeRole from "../controllers/employeeRoleMapping/editEmployeeRole";
import getAllRolesOfUser from "../controllers/employeeRoleMapping/getAllRolesOfUser";
import { searchUser } from "../controllers/userInformation/searchUser";
import decodeTokens from "../middleware/decodeTokens";
import { searchUserFilter } from "../controllers/userInformation/searchUserFilter";
import getAllUsers from "../controllers/userInformation/getAllUser";
import updateUserRoleToProjectManager from "../controllers/employeeRoleMapping/updateEmployeeRoleToProjectManager";
import getUserInformationById from "../controllers/userInformation/getUserInformationById";
import getUserInformationByRoleId from "../controllers/employeeRoleMapping/getAllTeamManager";
import getAllTeamManager from "../controllers/employeeRoleMapping/getAllTeamManager";

const userInformationRouter: Router = express.Router();
userInformationRouter.post(
  "/addUser",
  decodeTokens,
  async (req: Request, res: Response) => {
    postUserInformation(req, res);
  }
);
userInformationRouter.get("/getUser", async (req: Request, res: Response) => {
  getUser(req, res);
});

userInformationRouter.get(
  "/getUserInformationById",
  async (req: Request, res: Response) => {
    getUserInformationById(req, res);
  }
);
userInformationRouter.put("/editUser", async (req: Request, res: Response) => {
  putUserInformation(req, res);
});
userInformationRouter.get(
  "/getAllUsers",
  async (req: Request, res: Response) => {
    getAllUsers(req, res);
  }
);

userInformationRouter.get(
  "/searchUser",
  async (req: Request, res: Response) => {
    searchUser(req, res);
  }
);

userInformationRouter.post(
  "/searchUserFilter",
  async (req: Request, res: Response) => {
    searchUserFilter(req, res);
  }
);

userInformationRouter.post(
  "/employeeRole",
  async (req: Request, res: Response) => {
    addEmployeeRole(req, res);
  }
);

userInformationRouter.patch(
  "/employeeRole",
  async (req: Request, res: Response) => {
    editEmployeeRole(req, res);
  }
);

userInformationRouter.get(
  "/employeeRole/:id",
  async (req: Request, res: Response) => {
    getAllRolesOfUser(req, res);
  }
);

userInformationRouter.put(
  "/employeeRole/:id",
  async (req: Request, res: Response) => {
    updateUserRoleToProjectManager(req, res);
  }
);

userInformationRouter.get(
  "/employeeRole/teamManager",
  async (req: Request, res: Response) => {
    getAllTeamManager(req, res);
  }
);

export default userInformationRouter;
