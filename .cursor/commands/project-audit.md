---
name: project-scaffold
description: Create or safely update standardized README.md and .gitignore files for the current web project based on its actual stack and tooling.
---
# Project scaffold

## Purpose
Make project documentation and Git exclusions consistent without assuming every client project has the same setup.

## Process
1. Inspect the repository root, `package.json`, lockfiles, Astro configuration, build scripts, deployment configuration, and existing `README.md` and `.gitignore`.
2. Identify the actual framework, package manager, scripts, integrations, test tools, environment-variable conventions, and hosting platform. Do not infer tools that are not present.
3. For `README.md`, include only relevant sections:
   - Project name and concise purpose
   - Stack and notable integrations
   - Prerequisites
   - Installation using the detected package manager
   - Development, build, preview, lint, type-check, and test commands that actually exist
   - Project structure where useful
   - Environment variables by name, with safe placeholder descriptions only
   - Deployment notes that match the configured platform
   - Content or maintenance notes if useful
4. For `.gitignore`, add appropriate exclusions for the detected stack, including dependencies, generated build output, caches, logs, local environment files, and editor/OS clutter when appropriate.
5. Preserve useful project-specific documentation and ignore patterns. If either file exists, inspect and merge missing content rather than replacing it wholesale.
6. Never put secret values, API keys, passwords, private URLs, or real credentials into documentation. Document variable names and how to obtain/configure them instead.
7. Do not ignore files required for reproducible builds, such as lockfiles, unless the project has a deliberate documented reason.
8. Avoid overly broad ignore patterns that could hide source files or required assets.
9. Do not initialize Git, commit, push, install dependencies, or run destructive commands unless explicitly requested.
10. After changes, summarize what was added, what was preserved, and any stack assumptions. Validate ignore patterns and README commands against the repository where possible; do not claim checks that were not run.
11. Ignore hidden folders unless they are absolutely necessary to the repo.
12. Ignore items and artifacts that are used specifically for cursor and not necessary to the integrity of the repo. docs/ would be included if it is being used to hold critical context needed to build the main site. Source should not be kept if it is replicated somehwere else in the repo.

## Output
A concise report of the files created or updated, stack-specific decisions, and any manual setup still needed.
