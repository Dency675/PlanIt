import express from "express";
import { Request, Response } from "express";
import addNoteInformation from "../controllers/noteInformation/addNoteInformation";
import getNoteInformation from "../controllers/noteInformation/getNoteInformation";
import getNoteInformationById from "../controllers/noteInformation/getNoteInformationById";
import deleteNoteInformation from "../controllers/noteInformation/deleteNoteInformation";
import editNoteInformation from "../controllers/noteInformation/editNoteInformation";
import searchAndSortNoteInformation from "../controllers/noteInformation/searchAndSortNoteInformation";

const noteInformationRouter = express.Router();

noteInformationRouter.post("/note", (req: Request, res: Response) => {
  addNoteInformation(req, res);
});

noteInformationRouter.get("/note", (req: Request, res: Response) => {
  getNoteInformation(req, res);
});

noteInformationRouter.get("/note/:id", (req: Request, res: Response) => {
  getNoteInformationById(req, res);
});

noteInformationRouter.delete("/note/:id", (req: Request, res: Response) => {
  deleteNoteInformation(req, res);
});

noteInformationRouter.put("/note", (req: Request, res: Response) => {
  editNoteInformation(req, res);
});

noteInformationRouter.get("/note/:title", (req: Request, res: Response) => {
  searchAndSortNoteInformation(req, res);
});

export default noteInformationRouter;
