/init to init claude.md

planning vs thinking = breadth vs depth

'#' adds a new rule to claude.md intelligently
'@' references a file or folder in the project structure

Esc to interrupt claude's response
Double Esc to rewind to a previous point in the conversation

/compact after having claude learn about a specific task (e.g. writing a test)
/clear to reset claude's memory, use when starting a new task

custom commands:
 ./claude/commands/some-command.md
 - e.g. for writing tests for a new feature ./claude/commands/test-validate.md
 - args for the commands are written as $ARGUMENTS in the command file

playwright MCP for browser control:
claude mcp add playwright npx @playwright/mcp@latest

useful hooks: 
 run tsc check after any writes
 hook to review claude changes and implement the review feedback and potentially edit claude.md, ideally for just a subset of the project
 hook to sanitize and optimize my prompt
 auto format files
 enforce test driven development