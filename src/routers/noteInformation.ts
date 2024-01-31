import express from "express";
import { Request, Response } from "express";
import addNoteInformation from "../controllers/noteInformation/addNoteInformation";
import getNoteInformation from "../controllers/noteInformation/getNoteInformation";
import getNoteInformationById from "../controllers/noteInformation/getNoteInformationById";
import deleteNoteInformation from "../controllers/noteInformation/deleteNoteInformation";
import editNoteInformation from "../controllers/noteInformation/editNoteInformation";
import searchAndSortNoteInformation from "../controllers/noteInformation/searchAndSortNoteInformation";

const noteInformationRouter = express.Router();

noteInformationRouter.post(
  "/addNoteInformation",
  (req: Request, res: Response) => {
    addNoteInformation(req, res);
  }
);

noteInformationRouter.get(
  "/getNoteInformation",
  (req: Request, res: Response) => {
    getNoteInformation(req, res);
  }
);

noteInformationRouter.get(
  "/getNoteInformationById",
  (req: Request, res: Response) => {
    getNoteInformationById(req, res);
  }
);

noteInformationRouter.delete(
  "/deleteNoteInformation",
  (req: Request, res: Response) => {
    deleteNoteInformation(req, res);
  }
);

noteInformationRouter.put(
  "/editNoteInformation",
  (req: Request, res: Response) => {
    editNoteInformation(req, res);
  }
);

noteInformationRouter.get(
  "/searchAndSortNoteInformation",
  (req: Request, res: Response) => {
    searchAndSortNoteInformation(req, res);
  }
);

export default noteInformationRouter;
