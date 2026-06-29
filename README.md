# n8n + Cursor MCP Autopilot Protocol 🤖🔄

An open-source, copy-and-paste blueprint for building autonomous, self-healing n8n workflow deployment loops using Cursor IDE and the Model Context Protocol (MCP).

This repository provides a standardized safety framework and execution protocol that allows an AI agent to write, deploy, test, and debug n8n workflows completely on its own—without you having to manually export/import JSON files or babysit the execution loop.

---

## 🚀 What This Does

When you hook Cursor up to your n8n instance via MCP using this protocol, your AI agent follows a strict operational loop:

1. **Staging-Only Guardrails:** The agent is restricted to building and executing *only* within a designated Staging environment. It is strictly forbidden from touching Production without explicit human authorization.
2. **Self-Healing Loop:** If a test execution throws a workflow error, Cursor automatically reads the error logs, adjusts the workflow nodes, redeploys, and retries (capped at 5 attempts).
3. **Intelligent Circuit Breakers:** The agent dynamically distinguishes between a configuration/logic bug (which it will try to fix) and an environmental blocker like an expired API token or missing n8n credential (where it will stop immediately and ask for human intervention).

---

## 📂 Repository Structure

*   **`n8n-autopilot.md`**: The core playbook and step-by-step setup guide. It contains:
    *   The configuration snippet for your `.cursor/mcp.json` file.
    *   The exact system rules block for your `.cursor/rules/n8n-autopilot.mdc` file.
    *   The precise chat prompt to trigger the autopilot loop.
    *   Success criteria, error-handling states, and an optional team Git workflow.

---

## 🛠️ Quick Start

1. Clone or copy the contents of this repository.
2. Follow the detailed step-by-step instructions inside **`n8n-autopilot.md`** to configure your `.cursor/mcp.json` and `.cursor/rules/n8n-autopilot.mdc` files.
3. Restart Cursor, verify your `n8n-mcp` connection is green, and start prompting!

---

## 💡 Contributing & Feedback

This protocol was built to save hours of manual dragging, dropping, and debugging. If you have optimizations for the agent rules or find edge cases with the n8n MCP server setup, feel free to open an Issue or submit a Pull Request!

*Inspired by the automated workflow discussions on LinkedIn. Feel free to connect and share your automated builds!*
