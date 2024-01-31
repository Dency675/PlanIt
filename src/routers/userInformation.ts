import express, { Request, Response, Router } from "express";
import postUserInformation from "../controllers/userInformation/postUserInformation";
import getUser from "../controllers/userInformation/getUserInformation";
import putUserInformation from "../controllers/userInformation/putUserInformation";


const userInformationRouter: Router = express.Router();
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


