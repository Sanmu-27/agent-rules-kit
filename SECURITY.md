# Security Policy

## Reporting A Vulnerability

If you find a security issue, please do not open a public issue with exploit details.

Instead, email the maintainer listed in `package.json` or open a private security advisory on GitHub after the repository is published.

Please include:

- affected version or commit
- impact
- reproduction steps
- suggested fix if you have one

## Scope

This project is a local CLI and rule library. Security-sensitive areas include:

- file writes outside the requested target directory
- unsafe overwrite behavior
- command execution
- dependency supply chain issues
- misleading security rules

The CLI is designed to avoid network access and avoid shelling out to other commands.
