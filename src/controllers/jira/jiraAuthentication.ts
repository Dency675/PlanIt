import express, { Request, Response } from "express";
import querystring from "querystring";

export const jiraAuthentication = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;

    const { sessionId } = req.query as { sessionId: string };

    console.log(req.params);

    console.log("sessionId", teamId, sessionId);
    if (sessionId === undefined) {
      const authUrl = `https://auth.atlassian.com/authorize?${querystring.stringify(
        {
          client_id: process.env.JIRA_CLIENTID,
          redirect_uri: `${process.env.REDIRECT_URI}?id=${teamId}`,
          response_type: "code",
          scope:
            "read:jira-user write:issue:jira-software read:issue:jira-software read:issue-details:jira manage:jira-project manage:jira-configuration read:board-scope:jira-software read:sprint:jira-software read:board-scope.admin:jira-software read:dashboard:jira read:project:jira write:issue:jira read:me write:jira-work read:jira-work  read:issue-meta:jira write:issue-link:jira read:board-scope.admin:jira-software read:dashboard:jira",
          audience: "api.atlassian.com",
        }
      )}`;
      res.redirect(authUrl);
    } else {
      const authUrl = `https://auth.atlassian.com/authorize?${querystring.stringify(
        {
          client_id: process.env.JIRA_CLIENTID,
          redirect_uri: `${process.env.REDIRECT_URI}?sessionId=${sessionId}`,
          response_type: "code",
          scope:
            "read:jira-user write:issue:jira-software read:issue:jira-software read:issue-details:jira manage:jira-project manage:jira-configuration read:board-scope:jira-software read:sprint:jira-software read:board-scope.admin:jira-software read:dashboard:jira read:project:jira write:issue:jira read:me write:jira-work read:jira-work  read:issue-meta:jira write:issue-link:jira read:board-scope.admin:jira-software read:dashboard:jira",
          audience: "api.atlassian.com",
        }
      )}`;
      res.redirect(authUrl);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
