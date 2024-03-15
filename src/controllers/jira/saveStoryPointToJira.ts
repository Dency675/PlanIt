import axios from "axios";
import express, { Request, Response } from "express";
import querystring from "querystring";

export const saveStoryPointToJira = async (req: Request, res: Response) => {
  const { code, sessionId } = req.query as { code: string; sessionId: string };
  const { issueKey, storyPointValue, cloudId } = req.body;

  console.log("code", code);
  console.log("id", sessionId);
  try {
    const tokenResponse = await axios.post(
      "https://auth.atlassian.com/oauth/token",

      {
        grant_type: "authorization_code",
        client_id: process.env.JIRA_CLIENTID,
        client_secret: process.env.JIRA_CLIENTSECRET,
        redirect_uri: `${process.env.REDIRECT_URI}?sessionId=${sessionId}`,
        code,
      }
    );

    const accessToken = tokenResponse.data.access_token;

    console.log("accessToken", accessToken);

    if (accessToken) {
      try {
        const apiUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/2/issue/${issueKey}`;

        const requestBody = {
          fields: {
            customfield_10016: Number(storyPointValue),
          },
        };

        const response = await axios.put(apiUrl, requestBody, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return res.json({
          tokenResponse: tokenResponse.data,
          responseFromJira: response.data,
        });
      } catch (error) {
        console.error("Error authenticating with save data to Jira:", error);
        return res.status(500).send(`Error authenticating with Jira${error}`);
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
