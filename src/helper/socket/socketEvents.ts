import { Server, Socket } from "socket.io";
import { sendEmailNotification } from "../../controllers/email/send_mail";
import userInformation from "../../models/userInformation";
import sessionParticipants from "../../models/sessionParticipants";
import sessions from "../../models/sessions";

interface UserData {
  userName: string;
  roleId: number;
  teamMemberId: number;
  score: {
    userStorySessionMappingId: number;
    storyPoint: string;
  }[];
}

export const joinRoom = async (
  io: Server,
  socket: Socket,
  userId: string,
  sessionId: string
) => {
  try {
    socket.join(sessionId);
    io.to(sessionId).emit("userJoined", { sessionId, userId });
    console.log(`User ${userId} joined room ${sessionId}`);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const startVoting = async (
  io: Server,
  socket: Socket,
  sessionId: string,
  isStartButtonStarted: boolean
) => {
  try {
    console.log("startVoting", sessionId, isStartButtonStarted);
    socket.join(sessionId);

    console.log("votingStarted");
    io.to(sessionId).emit("votingStarted", sessionId, isStartButtonStarted);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const revealClicked = async (
  io: Server,
  socket: Socket,
  sessionId: string,
  selectedUserStoryId: number
) => {
  try {
    socket.join(sessionId);

    io.to(sessionId).emit("showResult", sessionId, selectedUserStoryId);
    io.to(sessionId).emit("enableCommentBox", sessionId);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const startButtonClicked = async (
  io: Server,
  socket: Socket,
  sessionId: string,
  count: number
) => {
  try {
    socket.join(sessionId);

    io.to(sessionId).emit("showParticipants", sessionId, count);
    io.to(sessionId).emit("disableCommentBox", sessionId);
    io.to(sessionId).emit("resetSeletedCard", sessionId);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const resultSaved = async (
  io: Server,
  socket: Socket,
  sessionId: string
) => {
  try {
    socket.join(sessionId);

    io.to(sessionId).emit("showParticipantsList", sessionId);
    io.to(sessionId).emit("disableCommentBox", sessionId);
    io.to(sessionId).emit("resetSeletedCard", sessionId);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const saveResultClicked = async (
  io: Server,
  socket: Socket,
  sessionId: string
) => {
  try {
    socket.join(sessionId);

    io.to(sessionId).emit("commentBoxValidation", sessionId);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const userVoted = async (
  io: Server,
  socket: Socket,
  sessionId: string,
  teamMemberId: string,
  index: number
) => {
  try {
    socket.join(sessionId);
    console.log("userVoted", sessionId, teamMemberId);
    console.log("userVotedAdded");
    io.to(sessionId).emit("userVotedAdded", sessionId, teamMemberId, index);
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const sessionParticipantsScore = async (
  io: Server,
  socket: Socket,
  sessionId: string,
  userData: UserData
) => {
  try {
    socket.join(sessionId);
    console.log("sessionParticipantsScore", sessionId, userData);

    io.to(sessionId).emit(
      "currentSessionParticipantsScore",
      sessionId,
      userData
    );
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const sessionEnded = async (
  io: Server,
  socket: Socket,
  sessionId: string
) => {
  try {
    socket.join(sessionId);

    io.to(sessionId).emit("exitUsers");
  } catch (error) {
    console.error("Error joining room:", error);
  }
};

export const userStorySelected = async (
  io: Server,
  socket: Socket,
  userStoryMappingId: string,
  sessionId: string
) => {
  try {
    console.log(userStoryMappingId);
    console.log(typeof userStoryMappingId);
    console.log(sessionId);

    io.to(sessionId).emit("userStoryMappingIdDeveloper", {
      userStoryMappingId,
      sessionId,
    });
  } catch (error) {
    console.error("Error creating room:", error);
  }
};

export const createRoom = async (
  io: Server,
  socket: Socket,
  sessionId: string
) => {
  try {
    const planningparticipants = await sessionParticipants.findAll({
      where: { sessionId: sessionId },
      attributes: [],
      include: [
        {
          model: userInformation,
          as: "user",
          attributes: ["givenName", "email"],
        },
      ],
    });

    const session = await sessions.findOne({
      where: { id: sessionId },
      attributes: ["sessionTitle"],
    });

    const participantsInfo = planningparticipants.map((participant) => ({
      name: participant.user.givenName,
      email: participant.user.email,
      storyName: session?.sessionTitle,
    }));
    sendEmailNotification("planningPokerStarted", participantsInfo);
    socket.join(sessionId);

    io.emit("roomCreated", sessionId);
    console.log(`Room created`);
  } catch (error) {
    console.error("Error creating room:", error);
  }
};

export const timerSet = async (
  io: Server,
  socket: Socket,
  isTimerRunning: boolean,
  sessionId: string,
  currentTime: string
) => {
  //   try {
  socket.join(sessionId);

  console.log("timer set");
  io.to(sessionId).emit("timerShow", {
    isTimerRunning,
    sessionId,
    currentTime,
  });

  //   socket.join(sessionId);
  //   io.to(sessionId).emit("timerShow", {
  //     isTimerRunning,
  //     sessionId,
  //     currentTime,
  //   });

  //   } catch (error) {
  //     console.error("Error creating room:", error);
  //   }
};
