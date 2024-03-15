import axios from "axios";
import express, { Request, Response } from "express";
import querystring from "querystring";

export const getAllIssuesFromJira = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization;
    const sprintId = req.query.sprintId as string;
    const cloudId = req.query.cloudId as string;
    const boardId = req.query.boardId as string;

    const issueData = await axios.get(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/agile/1.0/board/${boardId}/issue?jql=sprint=${sprintId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `${accessToken}`,
        },
      }
    );

    return res.status(200).json({
      issueData: issueData.data,
    });
  } catch (error) {
    console.error("Error authenticating with Jira:", error);
    return res.status(500).send(`Error authenticating with Jira`);
  }
};
