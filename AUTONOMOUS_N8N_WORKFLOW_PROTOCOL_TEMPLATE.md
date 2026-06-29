# n8n Autopilot Setup

This is a copy/paste playbook for people who build n8n workflows and use Cursor, even if they do not write code.

The goal is simple: Cursor should be able to upload a workflow to n8n, run it, read the error, fix it, and try again without you babysitting every step.

## Step 0: Create Your Workflow Note

Create one small note for each workflow so Cursor knows what it is working on.

Suggested file location:

```text
YourWorkflowFolder/n8n-autopilot.md
```

Example:

```text
acquisition/googleAudiences/n8n-autopilot.md
```

Copy this into that file and fill it in:

```text
Workflow name:
Workflow folder:
Staging workflow ID:
Production workflow ID:
What data does this workflow use?
Where are the passwords/API keys saved in n8n?
What should happen when it works?
Who should be told manually if it fails?
Max retry attempts: 5
```

Do not paste Google, Stripe, Meta, customer data, or other private secrets into this note. Put those in n8n credentials.

For example, "What should happen when it works?" could be: "100 contacts are uploaded to Google Audiences and n8n shows no failed items."

"Who should be told manually if it fails?" does not create an automatic alert. It only tells Cursor who the human contact is. Automatic Slack, email, or WhatsApp alerts need to be added as real n8n workflow steps.

## Step 1: Connect Cursor To n8n

Create this file in your project:

```text
.cursor/mcp.json
```

Paste this inside and replace the two placeholder values:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "-p", "ajv", "-p", "n8n-mcp", "n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-n8n-api-key"
      }
    }
  }
}
```

In n8n, create the API key from `Settings > API`.

After saving the file, restart Cursor. In Cursor settings, check that `n8n-mcp` is green.

## Step 2: Tell Cursor The Rules

These are sample rules. You can change the wording for your company, but keep the ideas: staging first, run the workflow, inspect errors, retry up to 5 times, and never deploy production unless asked.

Create this file:

```text
.cursor/rules/n8n-autopilot.mdc
```

Paste this entire block into that file:

```markdown
---
description: n8n autopilot workflow rules
globs: **/*
alwaysApply: false
---

# n8n Autopilot Rules

When working on an n8n workflow:

- Read the workflow's `n8n-autopilot.md` note first.
- Never deploy to production unless the user clearly says so.
- Deploy changes to the staging workflow.
- Run the staging workflow after deploying.
- Read the execution result before saying it worked.
- If it fails, fix the workflow and try again.
- Try at most 5 fixes for problems Cursor can actually fix.
- Stop immediately and ask the user if the error is a missing credential, missing API key, missing permission, disabled API, blocked account, or any other setup problem outside the workflow.
- After each failed try, write down the error, the suspected cause, and what changed.
- Stop after 5 failed fixes and explain what manual help is needed.
- Never commit or print real secrets.
```

What is `globs`?

`globs` tells Cursor which files/folders these rules apply to.

If you want the rules to apply everywhere, keep:

`globs: **/*`

If the workflow lives in one folder, replace that line with the folder path:

`globs: CreditCard/googleAudiences/**`

## Step 3: How Cursor Must Work

This part is not a file. This is the message you type into Cursor chat when you want it to work on the workflow:

```text
Use the n8n autopilot rules.
Work only on the staging workflow.
Read the workflow note first.
Upload the workflow through MCP.
Run it.
If it fails, debug and retry up to 5 times.
If the error is a missing credential, missing permission, or disabled API, stop and tell me exactly what I need to fix.
Do not deploy to production unless I explicitly ask.
```

Cursor should then follow this loop internally:

- Edit workflow.
- Upload to staging n8n.
- Run workflow.
- Check result.
- If success, report what happened.
- If failed, fix and try again.
- If blocked by missing credentials, permissions, or account setup, stop and ask the user.
- Stop after 5 failed fixes.

## Step 4: What Success Means

Before Cursor says “done”, it must confirm:

- Was it uploaded to staging?
- Did the workflow run successfully?
- How many records/items were processed?
- Were there any partial errors?
- Where are the request IDs, job IDs, or logs?
- Were secrets kept out of files and logs?

If these are not clear, the workflow is not finished.

## Step 5: If Everything Breaks

If the workflow still fails after 5 fixes, Cursor must stop and report:

- What failed.
- Where it failed.
- Exact error.
- What Cursor tried.
- Most likely cause.
- Rollback status.
- What a human needs to do next.

Cursor should not keep guessing forever.

## Common MCP Problem

If Cursor shows:

```text
connection:connect_failure
```

Check these:

```text
Did you restart Cursor?
Is .cursor/mcp.json valid JSON?
Is the n8n URL correct?
Is the n8n API key correct?
Is n8n-mcp green in Cursor settings?
```

The `ajv` part in the config is intentional. It avoids a common Windows startup error:

```text
Cannot find module 'ajv'
```

## Optional: Team Git Workflow

Skip this section if you are working alone or do not use Git.

For teams, Git gives you a safer way to test changes before they become the official workflow version.

Ask Cursor to follow this Git flow:

```text
Work on a new branch.
Test everything there.
When the staging workflow works, ask me before merging to staging.
Do not update production unless I clearly approve it.
If I approve production, create a PR to main.
After I confirm main is updated, deploy the production n8n workflow from main.
```
