import express from "express";
import { Request, Response } from "express";
import addRoles from "../controllers/roles/addRoles";
import getRoleByID from "../controllers/roles/getRoleByID";
import editRoles from "../controllers/roles/editRoles";
import getAllRoles from "../controllers/roles/getAllRoles";
import deleteRole from "../controllers/roles/deleteRoles";

const roleRouter = express.Router();

roleRouter.post("/roles", (req: Request, res: Response) => {
  addRoles(req, res);
});

roleRouter.get("/roles", (req: Request, res: Response) => {
  getAllRoles(req, res);
});
roleRouter.get("/roles/:id", (req: Request, res: Response) => {
  getRoleByID(req, res);
});
roleRouter.put("/roles/:id", (req: Request, res: Response) => {
  editRoles(req, res);
});
roleRouter.delete("/roles/:id", (req: Request, res: Response) => {
  deleteRole(req, res);
});

export default roleRouter;
