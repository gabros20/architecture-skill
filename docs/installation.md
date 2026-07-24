# Installation

Install the `architecture` runtime pack from the independently versioned
`gabros20/architecture-skill` repository.

## Prerequisites

- An Agent Skills-compatible client (Codex, Claude Code, Cursor, or similar).
- No API keys, credentials, or extra tooling — `architecture` is a reasoning-and-reference skill.

## Install with skills.sh

```bash
npx skills add gabros20/architecture-skill
```

## Clone and install

```bash
git clone https://github.com/gabros20/architecture-skill.git
cd architecture-skill
./install.sh codex
```

Available targets:

| Argument | Destination |
|---|---|
| `codex` | `${CODEX_HOME:-$HOME/.codex}/skills/architecture/` |
| `agents` | `~/.agents/skills/architecture/` |
| `claude` | `~/.claude/skills/architecture/` |
| `cursor` | `~/.cursor/skills/architecture/` |
| `antigravity` | Gemini IDE and Antigravity CLI skill paths |
| `opencode` | `~/.config/opencode/skills/architecture/` |
| `grok` | `~/.grok/skills/architecture/` |
| `hermes` | `~/.hermes/skills/architecture/` |
| `all` | Claude, Codex, and the cross-agent path |

The installer stages a complete copy before replacing an existing installation. If replacement
fails, it restores the previous copy.

## Verify

Start a new client session and use the client's supported invocation form:

- Codex: `$architecture`
- Slash-command clients: `/architecture`
- Other clients: an `@` mention, skill tool, or natural-language trigger

For Codex, verify the installed files directly:

```bash
test -f "${CODEX_HOME:-$HOME/.codex}/skills/architecture/SKILL.md"
```

## Update

```bash
cd architecture-skill
git pull --ff-only
./install.sh codex
```

Review `CHANGELOG.md` and GitHub Releases for version history. Version metadata intentionally stays
outside runtime `SKILL.md`.

## Uninstall

```bash
rm -rf "${CODEX_HOME:-$HOME/.codex}/skills/architecture"
```
