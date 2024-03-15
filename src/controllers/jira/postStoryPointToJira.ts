import axios from "axios";
import express, { Request, Response } from "express";
import querystring from "querystring";

export const postStoryPointToJira = async (req: Request, res: Response) => {
  try {
    const { issueKey, storyPointValue, cloudId } = req.body;
    const { sessionId, code } = req.query as {
      code: string;
      sessionId: string;
    };

    try {
      const tokenResponse = await axios.post(
        "https://auth.atlassian.com/oauth/token",

        {
          grant_type: "authorization_code",
          client_id: process.env.JIRA_CLIENTID,
          client_secret: process.env.JIRA_CLIENTSECRET,
          redirect_uri: `${process.env.REDIRECT_URI}?id=${sessionId}`,
          code,
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const apiUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/2/issue/${issueKey}`;

      const requestBody = {
        fields: {
          customfield_10016: storyPointValue,
        },
      };

      const response = await axios.put(apiUrl, requestBody, {
        headers: {
          Accept: "application/json",
          Authorization: `${accessToken}`,
        },
      });
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).send(`Error updating issue`);
    }
  } catch (error) {
    console.error("Error updating issue:", error);
    return res.status(500).send(`Error updating issueeeeeeeeee`);
  }
};
