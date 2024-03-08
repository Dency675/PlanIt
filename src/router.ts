import { Express } from "express";
import teamInformationRouter from "./routers/teamInformation";
import userStoriesRouter from "./routers/userStories";
import noteInformationRouter from "./routers/noteInformation";
import estimationRouter from "./routers/estimationsRouter";
import scaleRouter from "./routers/scalesRouter";
import calculationsRouter from "./routers/calculations";
import roleRouter from "./routers/roles";
import userInformationRouter from "./routers/userInformation";
import sessionRouter from "./routers/sessions";
import teamMemberInformationRouter from "./routers/teamMemberInformation";
import userStorySesssionMappingRouter from "./routers/userStorySessionMapping";
import participantScoresRouter from "./routers/participantScores";
import notificationRouter from "./routers/notification";

const chooseRoutes = (app: Express) => {
  app.use(teamInformationRouter);
  app.use(userStoriesRouter);
  app.use(noteInformationRouter);
  app.use(estimationRouter);
  app.use(scaleRouter);
  app.use(calculationsRouter);
  app.use(roleRouter);
  app.use(userInformationRouter);
  app.use(sessionRouter);
  app.use(teamMemberInformationRouter);
  app.use(userStorySesssionMappingRouter);
  app.use(participantScoresRouter);
  // app.use(notificationRouter);
};

export default chooseRoutes;
