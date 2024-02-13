import express from "express";
import { Request, Response } from "express";
import addSessions from "../controllers/sessions/addSessions";
import getSessionById from "../controllers/sessions/getSessionById";
import editSessions from "../controllers/sessions/editSessions";
import getAllOngoingMeetings from "../controllers/sessions/getAllOngoingMeetings";
import getAllRecentMeetings from "../controllers/sessions/getAllRecentMeetings";
import addSessionParticipants from "../controllers/sessions/addSessionParticipants";
import getParticipantsInSession from "../controllers/sessions/getParticipantsInSession";
import getDevelopersInSession from "../controllers/sessions/getDevelopersInSession";
import getAllRecentMeetingsOfUser from "../controllers/sessions/getAllRecentMeetingsOfUser";
import getAllOngoingMeetingsOfUser from "../controllers/sessions/getAllOngoingMeetingsOfUser";
import multer from "multer";
import editSessionParticipants from "../controllers/sessions/editSessionParticipants";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/addSessions",
  upload.single("excelLink"),
  (req: Request, res: Response) => {
    addSessions(req, res);
  }
);
router.get("/getSessionById", (req: Request, res: Response) => {
  getSessionById(req, res);
});
router.patch("/editSessions", (req: Request, res: Response) => {
  editSessions(req, res);
});

router.get("/getAllOngoingMeetings", (req: Request, res: Response) => {
  getAllOngoingMeetings(req, res);
});
router.get("/getAllOngoingMeetingsOfUser", (req: Request, res: Response) => {
  getAllOngoingMeetingsOfUser(req, res);
});

router.get("/getAllRecentMeetings", (req: Request, res: Response) => {
  getAllRecentMeetings(req, res);
});
router.get("/getAllRecentMeetingsOfUser", (req: Request, res: Response) => {
  getAllRecentMeetingsOfUser(req, res);
});

router.post("/addSessionParticipants", (req: Request, res: Response) => {
  addSessionParticipants(req, res);
});
router.get("/getParticipantsInSession", (req: Request, res: Response) => {
  getParticipantsInSession(req, res);
});
router.get("/getDevelopersInSession", (req: Request, res: Response) => {
  getDevelopersInSession(req, res);
});

router.put("/editSessionParticipants", (req: Request, res: Response) => {
  editSessionParticipants(req, res);
});
export default router;
