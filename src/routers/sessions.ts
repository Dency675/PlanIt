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

const router = express.Router();

router.post("/addSessions", (req: Request, res: Response) => {
  addSessions(req, res);
});
router.get("/getSessionById", (req: Request, res: Response) => {
  getSessionById(req, res);
});
router.patch("/editSessions", (req: Request, res: Response) => {
  editSessions(req, res);
});

router.get("/getAllOngoingMeetings", (req: Request, res: Response) => {
  getAllOngoingMeetings(req, res);
});

router.get("/getAllRecentMeetings", (req: Request, res: Response) => {
  getAllRecentMeetings(req, res);
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
export default router;
