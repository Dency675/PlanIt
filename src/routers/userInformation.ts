import express, { Request, Response, Router } from "express";
import postUserInformation from "../controllers/userInformation/postUserInformation";
import getUser from "../controllers/userInformation/getUserInformation";
import putUserInformation from "../controllers/userInformation/putUserInformation";
import addEmployeeRole from "../controllers/employeeRoleMapping/addEmployeeRole";
import editEmployeeRole from "../controllers/employeeRoleMapping/editEmployeeRole";
import getAllRolesOfUser from "../controllers/employeeRoleMapping/getAllRolesOfUser";
import { searchUser } from "../controllers/userInformation/searchUser";

const userInformationRouter: Router = express.Router();
userInformationRouter.post("/addUser", async (req: Request, res: Response) => {
  postUserInformation(req, res);
});
userInformationRouter.get("/getUser", async (req: Request, res: Response) => {
  getUser(req, res);
});
userInformationRouter.put("/editUser", async (req: Request, res: Response) => {
  putUserInformation(req, res);
});

userInformationRouter.post(
  "/addEmployeeRole",
  async (req: Request, res: Response) => {
    addEmployeeRole(req, res);
  }
);

userInformationRouter.patch(
  "/editEmployeeRole",
  async (req: Request, res: Response) => {
    editEmployeeRole(req, res);
  }
);

userInformationRouter.get(
  "/getAllRolesOfUser",
  async (req: Request, res: Response) => {
    getAllRolesOfUser(req, res);
  }
);

userInformationRouter.get(
  "/searchUser",
  async (req: Request, res: Response) => {
    searchUser(req, res);
  }
);

export default userInformationRouter;
