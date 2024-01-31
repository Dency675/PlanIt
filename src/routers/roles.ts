import express from "express";
import { Request, Response, Router } from "express";
import addRoles from "../controllers/roles/addRoles";
import getRoleByID from "../controllers/roles/getRoleByID";
import editRoles from "../controllers/roles/editRoles";
import getAllRoles from "../controllers/roles/getAllRoles";
import deleteRole from "../controllers/roles/deleteRoles";

const roleRouter = express.Router();

roleRouter.post("/addRoles", (req: Request, res: Response) => {
  addRoles(req, res);
});

roleRouter.get("/getAllRoles", (req: Request, res: Response) => {
  getAllRoles(req, res);
});
roleRouter.get("/getRoleByID", (req: Request, res: Response) => {
  getRoleByID(req, res);
});
roleRouter.put("/editRoles", (req: Request, res: Response) => {
  editRoles(req, res);
});
roleRouter.delete("/deleteRole", (req: Request, res: Response) => {
  deleteRole(req, res);
});

export default roleRouter;
