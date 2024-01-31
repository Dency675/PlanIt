import express, { Request, Response, Router } from "express";
import postUserInformation from "../controllers/UserInformation/postUserInformation";
import getUser from "../controllers/UserInformation/getUserInformation";
import putUserInformation from "../controllers/UserInformation/putUserInformation";

const userInformationRouter: Router = express.Router();
//Routers for the userInformation table
userInformationRouter.post(
  "/addUser",
  async (req: Request, res: Response) => {
    postUserInformation(req, res);
  }
);
userInformationRouter.get(
    "/getUser",
    async (req: Request, res: Response) => {
        getUser(req, res);
    }
  );
  userInformationRouter.put(
    "/editUser",
    async (req: Request, res: Response) => {
        putUserInformation(req, res);
    }
  );
export default userInformationRouter;


