import axios from "axios";
import { Request, Response } from "express";

export const getAllSprintsFromJira = async (req: Request, res: Response) => {
  try {
    const projectId = req.query.projectId as string;
    const cloudId = req.query.cloudId as string;
    const { project, projectData } = req.body;
    const accessToken = req.headers.authorization;

    console.log(projectData);
    const boardData = projectData[projectId]?.boards || [];

    console.log("'projectId", projectId);
    console.log("boardIds", boardData);

    const allSprints: any[] = [];

    for (const board of boardData) {
      console.log("board", board);
      console.log("boardid", board.id);
      const sprintResponse = await axios.get(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/agile/1.0/board/${board.id}/sprint `,
        {
          headers: {
            Accept: "application/json",
            Authorization: `${accessToken}`,
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
    return res.status(500).send(`Error authenticating with Jira sprint`);
  }
};
