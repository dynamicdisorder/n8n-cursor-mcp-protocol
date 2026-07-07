# Supabase + Cursor SQL Autopilot

Build reporting SQL with Cursor without babysitting every error.

This playbook helps Cursor inspect your Supabase database, create reporting views, test them, fix SQL errors, and stop safely when it needs a human.

Think of it like an autopilot loop for business intelligence SQL:

```text
Inspect database -> write SQL -> create view -> run view -> verify result -> fix if needed
```

It is designed for people building products, dashboards, AI assistants, internal tools, or business intelligence systems with Supabase and Cursor.

You do not need to be a database engineer to use it.

## What This Is For

Use this when you want Cursor to create or improve Supabase/Postgres reporting logic, such as:

- revenue views
- KPI views
- product performance views
- customer or sales reports
- inventory analysis
- operational dashboards
- AI assistant query layers
- reusable business logic for apps, bots, or BI tools

The goal is not just to write SQL.

The goal is to create a trusted business layer in Supabase that other tools can use.

Examples:

```text
Supabase -> Telegram bot
Supabase -> Metabase
Supabase -> web app
Supabase -> mobile app
Supabase -> n8n workflow
```

## Files To Create

Create these two files in each project.

### 1. Main playbook

Create this file in the project root:

```text
supabase-sql-autopilot.md
```

This is the full instruction guide. Humans can read it. Cursor can read it.

### 2. Cursor rule

Create this file:

```text
.cursor/rules/supabase-mcp-sql-autopilot.mdc
```

This is the actual Cursor rule file. It tells Cursor to use this playbook when working on Supabase SQL.

Your project should look like this:

```text
your-project/
  supabase-sql-autopilot.md
  .cursor/
    rules/
      supabase-mcp-sql-autopilot.mdc
```

## Quick Setup

### Step 1: Connect Cursor to Supabase MCP

In Cursor:

```text
Cursor Settings -> Tools & MCP -> Add MCP Server
```

Recommended hosted setup:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

Some projects use a project-specific URL:

```text
https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF
```

After adding it:

```text
1. Authenticate in the browser if Cursor asks.
2. Restart or reload Cursor.
3. Confirm the Supabase MCP server is green.
```

Alternative token-based setup:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN"
      ]
    }
  }
}
```

Do not commit tokens or secrets to Git.

## Cursor Rule File

Put this in:

```text
.cursor/rules/supabase-mcp-sql-autopilot.mdc
```

```markdown
---
description: Supabase MCP SQL autopilot safety rules
globs:
  - "**/*.sql"
  - "**/*.md"
alwaysApply: false
---

# Supabase MCP SQL Autopilot Rules

When working with Supabase/Postgres through MCP:

1. Read `supabase-sql-autopilot.md` first if it exists.
2. Inspect before writing SQL.
3. Never assume schema, table, column, or type names.
4. Use MCP to execute and verify SQL.
5. Prefer `CREATE OR REPLACE VIEW` for reporting views.
6. Keep reporting objects in the configured reporting schema, usually `business`, unless told otherwise.
7. Never drop, delete, truncate, or update production data unless the user explicitly asks.
8. For each SQL object:
   - create it
   - run it
   - verify it
   - sanity-check the result
9. If an error happens:
   - diagnose
   - inspect actual DB structure
   - fix
   - retry
10. Maximum 5 attempts for the same issue.
11. After 5 failed attempts, stop and report:
   - exact error
   - what was tried
   - likely cause
   - safest human next step
   - suggested path to continue
12. Do not loop blindly.
13. For configurable values, prefer config tables over hardcoded constants.
14. Do not print or store secrets.
15. Do not create indexes, triggers, functions, tables, materialized views, policies, or extensions unless required and explained first.
```

## Trigger Prompt

Use this prompt when you want Cursor to run the autopilot loop:

```text
Use the Supabase SQL autopilot rules.

Read `supabase-sql-autopilot.md` first.
Use Supabase/Postgres MCP.
Inspect the database structure before writing SQL.
Create the requested reporting views one by one.
After each view, run it and verify the result.
If it fails, fix and retry up to 5 times for the same issue.
If blocked after 5 attempts, stop and tell me exactly what is wrong and what the safest next step is.
Do not drop, delete, truncate, or update production data.
```

## Project Note

Fill this out near the top of your project version of this file.

```text
Project name:
Database provider: Supabase/Postgres
Main data schema:
Reporting schema:
Allowed source schemas:
Allowed reporting object types:
Forbidden actions:
Production DDL allowed?
Preferred read tool:
Preferred write tool:
Max retry attempts:
Who reviews risky changes:
What does success mean:
```

Example:

```text
Project name: Retail Intelligence Platform
Database provider: Supabase/Postgres
Main data schema: public
Reporting schema: business
Allowed source schemas: public, business
Allowed reporting object types: views
Forbidden actions: drop, delete, truncate, update production data
Production DDL allowed? only after explicit approval
Preferred read tool: Supabase MCP execute_sql
Preferred write tool: Supabase MCP apply_migration
Max retry attempts: 5
Who reviews risky changes: owner
What does success mean: views exist, run successfully, sample rows make sense, and no production data was modified
```

## How Cursor Should Work

Cursor should follow this loop:

```text
1. Read this playbook.
2. Inspect the real Supabase database.
3. Find the real table names and columns.
4. Write the SQL.
5. Create or replace the view.
6. Run the view.
7. Check sample rows.
8. Check row counts.
9. Check date ranges if dates are involved.
10. Fix errors and retry if needed.
11. Stop after 5 failed attempts.
12. Report what happened.
```

Cursor should not guess.

If the column is not confirmed, Cursor should inspect the database.

If the table is not confirmed, Cursor should inspect the database.

If the business rule is unclear, Cursor should ask.

## What Cursor Is Allowed To Do

Safe by default:

- inspect schemas
- list tables
- list columns
- inspect existing views
- run read-only queries
- create or replace reporting views
- run sample checks
- create local `.sql` files
- explain assumptions

Not allowed unless explicitly approved:

- drop tables
- delete rows
- truncate tables
- update production data
- create triggers
- create indexes
- create tables
- create functions
- create materialized views
- change RLS policies
- expose private data to public users

## Where Reporting Views Should Live

Default recommendation:

```text
business
```

Example:

```sql
create schema if not exists business;

create or replace view business.vw_daily_revenue
with (security_invoker = true)
as
select
  sale_date,
  sum(revenue) as revenue
from public.sales
group by sale_date;
```

The reporting schema is like a clean business layer.

Raw data can stay in `public`.

Reusable business logic can live in `business`.

## Why Views First

Use normal views first because they are simple and safe.

Views are good for:

- reporting
- dashboards
- AI bot answers
- shared business logic
- cleaning raw data
- combining tables
- defining KPIs

Do not start with materialized views, functions, or extra tables unless you need them.

Start simple. Verify. Then optimize.

## When To Use Materialized Views

Only use materialized views when a normal view is too slow.

Before creating one, Cursor should explain:

- why a normal view is not enough
- how it will refresh
- how stale the data can be
- whether indexes are needed
- whether the user approves

## When To Use Functions

Use SQL functions when the question needs inputs.

Example:

```text
I have 300 euros. What shouold I invest in?
```

That might become:

```sql
business.fn_purchase_optimizer(
  budget,
  category,
  recovery_target,
  recovery_hours
)
```

But do not create functions first.

Build trusted views first.

## Verification Checklist

Before Cursor says done, it must confirm:

- what SQL file changed
- what Supabase object was created
- whether the object runs
- row count
- sample rows
- date range if relevant
- totals if relevant
- suspicious values found
- assumptions made
- whether production data was modified

Basic checks:

```sql
select count(*) from business.vw_example;
select * from business.vw_example limit 10;
```

Date check:

```sql
select
  min(sale_date) as first_date,
  max(sale_date) as last_date,
  count(*) as rows
from business.vw_example;
```

Money check:

```sql
select
  min(revenue) as min_revenue,
  max(revenue) as max_revenue,
  sum(revenue) as total_revenue
from business.vw_example;
```

## Retry Rules

Cursor can retry when the problem is a fixable SQL issue, such as:

- wrong column name
- wrong table name
- wrong schema
- type mismatch
- missing cast
- ambiguous column
- grouping error
- join issue
- view dependency order

Cursor must inspect the real database before retrying.

Cursor must change something based on evidence.

Cursor must not rerun the same broken SQL again and again.

Maximum retries for the same issue:

```text
5
```

## Stop Immediately

Cursor should stop and ask for help if:

- MCP is not connected
- Supabase authentication is missing
- database permission is missing
- a secret/API key is needed
- a destructive change is required
- the business rule is unclear
- private data might be exposed
- a production table must be changed
- an admin-only extension or setting is required

## Failure Report

If Cursor fails after 5 tries, it must stop and report:

```text
Object that failed:
Exact error:
What Cursor tried:
Likely cause:
Safest human next step:
Suggested path if you approve Cursor to continue:
```

Example:

```text
Object that failed: business.vw_revenue_by_product
Exact error: column "gross_profit" does not exist
What Cursor tried:
1. Queried the expected table.
2. Inspected information_schema.columns.
3. Looked for similar fields.
Likely cause: this project does not store margin at line level.
Safest human next step: confirm whether margin should be calculated from product cost.
Suggested path: approve a version that estimates margin as revenue minus current cost times quantity.
```

## Common Problems

If Supabase MCP does not work:

```text
Is the MCP server green in Cursor?
Did you restart Cursor?
Did you authenticate Supabase in the browser?
Is the project ref correct?
Does your Supabase account have access to the project?
Is `.cursor/mcp.json` valid JSON?
```

If a view does not appear:

```text
Check the correct schema.
Views may appear under Database -> Tables depending on the Supabase UI.
Realtime disabled is normal for reporting views.
```

If the query is slow:

```text
First verify correctness.
Then consider indexes or materialized views.
Do not optimize before the logic is trusted.
```

## Example: Daily Revenue View

This is only an example. Cursor must inspect your real database before using real table or column names.

```sql
create schema if not exists business;

create or replace view business.vw_daily_revenue
with (security_invoker = true)
as
select
  sold_at::date as sale_date,
  count(distinct ticket_id) as transactions,
  sum(line_total) as revenue
from public.sales_lines
where sold_at is not null
group by sold_at::date;
```

Verify it:

```sql
select count(*) from business.vw_daily_revenue;

select
  min(sale_date),
  max(sale_date),
  sum(revenue)
from business.vw_daily_revenue;

select *
from business.vw_daily_revenue
order by sale_date desc
limit 10;
```

## Example: Smart Same-Period YTD

If imports are delayed, do not compare against today's calendar date.

Use the latest date in the data.

Example:

```sql
with bounds as (
  select
    max(sale_date) as as_of_date,
    date_trunc('year', max(sale_date))::date as current_start,
    (date_trunc('year', max(sale_date)) - interval '1 year')::date as prior_start,
    (max(sale_date) - interval '1 year')::date as prior_end
  from business.vw_sales_base
)
select *
from bounds;
```

This creates comparisons like:

```text
2026-01-01 to 2026-05-27
vs
2025-01-01 to 2025-05-27
```

instead of accidentally comparing:

```text
2026-01-01 to today
vs
2025-01-01 to today last year
```

when your imported data only goes to May.

## Example Trigger Prompt For A Real Task

```text
Use the Supabase SQL autopilot rules.

Create reporting views for revenue attribution.
Read `supabase-sql-autopilot.md` first.
Use Supabase MCP.
Inspect the database before writing SQL.
Create views in the reporting schema.
Run and verify each view.
If a view fails, fix and retry up to 5 times.
Do not drop, delete, truncate, or update production data.
```

## Optional Team Workflow

If you use Git:

```text
1. Work on a branch.
2. Write SQL locally.
3. Test against staging or development first.
4. Verify every view.
5. Open a pull request.
6. Apply to production only after approval.
```

If you work alone, this is optional.

## Final Principle

Cursor can drive the loop, but the database is the source of truth.

The agent should inspect, create, test, and repair.

It should not guess.

It should not hide uncertainty.

It should not make destructive production changes without explicit approval.
