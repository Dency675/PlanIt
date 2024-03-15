import axios, { AxiosError } from "axios";
import express, { Request, Response } from "express";
import querystring from "querystring";

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

export const fetchProjectsFromJira = async (req: Request, res: Response) => {
  const { code, id } = req.query as { code: string; id: string };

  let projectsDataa: { [key: string]: Project } = {};

  console.log("code", code);
  console.log("id", id);
  try {
    const tokenResponse = await axios.post(
      "https://auth.atlassian.com/oauth/token",

      {
        grant_type: "authorization_code",
        client_id: process.env.JIRA_CLIENTID,
        client_secret: process.env.JIRA_CLIENTSECRET,
        redirect_uri: `${process.env.REDIRECT_URI}?id=${id}`,
        code,
      }
    );

    const accessToken = tokenResponse.data.access_token;

    console.log("accessToken", accessToken);

    try {
      const UserData = await axios.get("https://api.atlassian.com/me", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      try {
        const siteData = await axios.get(
          "https://api.atlassian.com/oauth/token/accessible-resources",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const cloudId = siteData.data[0].id;

        try {
          const ProjectData = await axios.get(
            `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/2/project`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          try {
            const boardData = await axios.get(
              `https://api.atlassian.com/ex/jira/${cloudId}/rest/agile/1.0/board`,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${accessToken}`,
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

            projectsDataa = boardData.data.values.reduce(
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
              siteData: siteData.data,
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

        return res.json({
          tokenResponse: tokenResponse.data,
          UserData: UserData.data,
          siteData: siteData.data,
          siteDataff: siteData.data[0].id,
        });
      } catch (error) {
        console.error("Error:", error);
      }

      return res.json({
        tokenResponse: tokenResponse.data,
        UserData: UserData.data,
      });
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

    return res.json({
      tokenResponse: tokenResponse.data,
    });
  } catch (error) {
    console.error("Error authenticating with Jira:", error);
    return res.status(500).send(`Error authenticating with Jira`);
  }
};
