import cors from "cors";
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { sequelizeSync } from "./services/sequelize";
import chooseRoutes from "./router";
import socketConnection from "./helper/socket";
import axios, { AxiosError, AxiosResponse } from "axios";
import querystring from "querystring";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const clientId = "nv2iBsbBxc6KKLlnmOEhx3FJ9ollTgQT";
const clientSecret =
  "ATOAHlTeqU-aNU3kUBn8oYINE4PXNC6pXS8163RAtO0IxEZz1mZeJNhtQ3NbwbSHdA298963A767";
const redirectUri = "http://localhost:3000/jiraAuth";
const jira_base_url = "https://planit06.atlassian.net";

const email: string = "neelamkavil2002@gmail.com";
const apiToken: string =
  "ATATT3xFfGF0OE3uYctfwraeMCRqASDfw6vWsyOOj0AKpEWbCY1QDmGJ5QVcWhM9yMS9WuVgbbSGfRCd25V6Un-23-QqPObTGACfGNi1PLew8SP988p1ZGyvww5Md0yfOmFbn1hgFE2Dba8omF6e-uJpkQDp1r-IuRDepabOkJQxBbZkGusIdN0=482770D7";

interface Board {
  id: number;
  name: string;
  location: {
    projectId: number;
    projectName: string;
    projectKey: string;
  };
}
interface Project {
  projectName: string;
  projectKey: string;
  boards: Board[];
}

let projectsData: { [key: string]: Project } = {};

const corsOptions = {
  origin: process.env.BASE_URL,
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;

sequelizeSync();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

chooseRoutes(app);

socketConnection(io);

app.get("/auth/jira", (req: Request, res: Response) => {
  // const authUrl = `https://auth.atlassian.com/authorize?${querystring.stringify(
  //   {
  //     client_id: clientId,
  //     redirect_uri: redirectUri,
  //     response_type: "code",
  //     scope: "read:jira-user",
  //     audience: "api.atlassian.com",
  //   }
  // )}`;
  // const YOUR_USER_BOUND_VALUE = "1234";
  const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=nv2iBsbBxc6KKLlnmOEhx3FJ9ollTgQT&scope=read%3Ame&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FjiraAuth&response_type=code&prompt=consent`;
  // const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=nv2iBsbBxc6KKLlnmOEhx3FJ9ollTgQT&scope=read%3Ame&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FjiraAuth&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;
  res.redirect(authUrl);
});

app.get("/auth/jira/callback", async (req: Request, res: Response) => {
  const { code } = req.query as { code: string };
  console.log("code", code);
  try {
    const tokenResponse = await axios.post(
      "https://auth.atlassian.com/oauth/token",

      {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }
    );

    const accessToken = tokenResponse.data.access_token;

    try {
      const UserData = await axios.get("https://api.atlassian.com/me", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const email: string = "neelamkavil2002@gmail.com";
      const apiToken: string =
        "ATATT3xFfGF0OE3uYctfwraeMCRqASDfw6vWsyOOj0AKpEWbCY1QDmGJ5QVcWhM9yMS9WuVgbbSGfRCd25V6Un-23-QqPObTGACfGNi1PLew8SP988p1ZGyvww5Md0yfOmFbn1hgFE2Dba8omF6e-uJpkQDp1r-IuRDepabOkJQxBbZkGusIdN0=482770D7";

      const authHeader: string = `Basic ${Buffer.from(
        `${email}:${apiToken}`
      ).toString("base64")}`;

      try {
        const ProjectData = await axios.get(
          "https://planit06.atlassian.net/rest/api/3/project",
          {
            headers: {
              Authorization: authHeader,
              Accept: "application/json",
            },
          }
        );

        try {
          const boardData = await axios.get(
            "https://planit06.atlassian.net/rest/agile/1.0/board",
            {
              headers: {
                Authorization: authHeader,
                Accept: "application/json",
              },
            }
          );

          const boards: Board[] = boardData.data.values.map((board: any) => ({
            id: board.id,
            name: board.name,
            location: {
              projectId: board.location.projectId,
              projectName: board.location.projectName,
              projectKey: board.location.projectKey,
            },
          }));

          const projects: { [key: number]: Project } = {};

          boards.forEach((board: Board) => {
            if (!projects[board.location.projectId]) {
              projects[board.location.projectId] = {
                projectName: board.location.projectName,
                projectKey: board.location.projectKey,
                boards: [],
              };
            }
            projects[board.location.projectId].boards.push({
              id: board.id,
              name: board.name,
              location: {
                projectId: board.location.projectId,
                projectName: board.location.projectName,
                projectKey: board.location.projectKey,
              },
            });
          });

          projectsData = boardData.data.values.reduce(
            (acc: any, board: any) => {
              if (!acc[board.location.projectId]) {
                acc[board.location.projectId] = {
                  boards: [],
                };
              }
              acc[board.location.projectId].boards.push(board.id);
              return acc;
            },
            {}
          );

          console.log(projects);

          return res.json({
            tokenResponse: tokenResponse.data,
            UserData: UserData.data,
            ProjectData: ProjectData.data,
            boardData: boardData.data,
            projects: projects,
          });
        } catch (error) {
          console.error("Error:", error);
        }
        return res.json({
          tokenResponse: tokenResponse.data,
          UserData: UserData.data,
          ProjectData: ProjectData.data,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        if (axiosError.response) {
          console.error("Error Data:", axiosError.response.data);
        } else if (axiosError.request) {
          console.error("No response received:", axiosError.request);
        } else {
          console.error("Error:", axiosError.message);
        }
      } else {
        console.error("Non-Axios Error:", error);
      }
    }

    return res.send(
      `Authentication successful. You can now access Jira resources.`
    );
  } catch (error) {
    console.error("Error authenticating with Jira:", error);
    return res.status(500).send(`Error authenticating with Jira`);
  }
});

app.get("/getAllSprints", async (req: Request, res: Response) => {
  try {
    const projectId = req.query.projectId as string;

    console.log(projectsData);
    const boardIds = projectsData[projectId]?.boards || [];

    console.log("'projectId", projectId);
    console.log("boardIds", boardIds);

    const email: string = "neelamkavil2002@gmail.com";
    const apiToken: string =
      "ATATT3xFfGF0OE3uYctfwraeMCRqASDfw6vWsyOOj0AKpEWbCY1QDmGJ5QVcWhM9yMS9WuVgbbSGfRCd25V6Un-23-QqPObTGACfGNi1PLew8SP988p1ZGyvww5Md0yfOmFbn1hgFE2Dba8omF6e-uJpkQDp1r-IuRDepabOkJQxBbZkGusIdN0=482770D7";

    const authHeader: string = `Basic ${Buffer.from(
      `${email}:${apiToken}`
    ).toString("base64")}`;

    const allSprints: any[] = [];

    for (const boardId of boardIds) {
      const sprintResponse = await axios.get(
        `https://planit06.atlassian.net/rest/agile/1.0/board/${boardId}/sprint`,
        {
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
          },
        }
      );

      console.log(sprintResponse.data);
      allSprints.push(...sprintResponse.data.values);
    }
    console.log("allSprints", allSprints);
    return res.status(200).json({
      allSprints,
    });
  } catch (error) {
    console.error("Error authenticating with Jira:", error);
    return res.status(500).send(`Error authenticating with Jira`);
  }
});
app.get("/getAllIssues", async (req: Request, res: Response) => {
  try {
    const email: string = "neelamkavil2002@gmail.com";
    const apiToken: string =
      "ATATT3xFfGF0OE3uYctfwraeMCRqASDfw6vWsyOOj0AKpEWbCY1QDmGJ5QVcWhM9yMS9WuVgbbSGfRCd25V6Un-23-QqPObTGACfGNi1PLew8SP988p1ZGyvww5Md0yfOmFbn1hgFE2Dba8omF6e-uJpkQDp1r-IuRDepabOkJQxBbZkGusIdN0=482770D7";

    const sprintId = req.query.sprintId as string;

    const authHeader: string = `Basic ${Buffer.from(
      `${email}:${apiToken}`
    ).toString("base64")}`;

    const issueData = await axios.get(
      `https://planit06.atlassian.net/rest/agile/1.0/sprint/${sprintId}/issue`,
      {
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
      }
    );
    console.log("issueData", issueData.data);

    return res.status(200).json({
      issueData: issueData.data,
    });
  } catch (error) {
    console.error("Error authenticating with Jira:", error);
    return res.status(500).send(`Error authenticating with Jira`);
  }
});

app.put("/postStoryPoint", async (req: Request, res: Response) => {
  try {
    const { issueKey, storyPointValue } = req.body;

    const apiUrl = `https://planit06.atlassian.net/rest/api/3/issue/${issueKey}`;

    const requestBody = {
      fields: {
        customfield_10016: storyPointValue,
      },
    };

    const email: string = "neelamkavil2002@gmail.com";
    const apiToken: string =
      "ATATT3xFfGF0OE3uYctfwraeMCRqASDfw6vWsyOOj0AKpEWbCY1QDmGJ5QVcWhM9yMS9WuVgbbSGfRCd25V6Un-23-QqPObTGACfGNi1PLew8SP988p1ZGyvww5Md0yfOmFbn1hgFE2Dba8omF6e-uJpkQDp1r-IuRDepabOkJQxBbZkGusIdN0=482770D7";

    const authHeader: string = `Basic ${Buffer.from(
      `${email}:${apiToken}`
    ).toString("base64")}`;

    const response = await axios.put(apiUrl, requestBody, {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error updating issue:", error);
    return res.status(500).send(`Error updating issue`);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
