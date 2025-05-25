class CommandParser {
    constructor() {
        this.commands = new Map();
        this.prefix = "/";
    }

    parseCommandAndArgs(message) {
        const trimmed = message.slice(this.prefix.length).trim();
        const commandEnd = trimmed.search(/\s/);

        if (commandEnd === -1) {
            return {
                command: trimmed.toLowerCase(),
                argsString: ""
            };
        }

        return {
            command: trimmed.slice(0, commandEnd).toLowerCase(),
            argsString: trimmed.slice(commandEnd + 1)
        };
    }

    parseArgs(argsString) {
        const args = [];
        const options = {};
        let current = "";
        let inQuote = false;
        let currentOption = null;

        for (let i = 0; i < argsString.length; i++) {
            const char = argsString[i];

            if (char === "\"") {
                inQuote = !inQuote;
                if (!inQuote) this.finalizeCurrentToken(current, currentOption, args, options);
                current = "";
                continue;
            }

            if (!inQuote) {
                if (char === "-" && argsString[i + 1] === "-") {
                    this.finalizeCurrentToken(current, currentOption, args, options);
                    currentOption = "";
                    current = "";
                    i++;
                    continue;
                }

                if (char === " ") {
                    this.finalizeCurrentToken(current, currentOption, args, options);
                    current = "";
                    continue;
                }
            }

            current += char;
        }

        this.finalizeCurrentToken(current, currentOption, args, options);
        return { args, options };
    }

    registerCommand(name, {
        description = "",
        usage = "",
        execute,
        minArgs = 0,
        maxArgs = Infinity
    }) {
        this.commands.set(name.toLowerCase(), {
            name,
            description,
            usage,
            execute,
            minArgs,
            maxArgs
        });
    }

    // Handle command execution
    async handleCommand(message) {
        if (!message.startsWith(this.prefix)) {
            return false;
        }

        const { command: commandName, argsString } = this.parseCommandAndArgs(message);
        const command = this.commands.get(commandName);

        if (!command) {
            throw new Error(`Unknown command: ${commandName}`);
        }

        const { args, options } = this.parseArgs(argsString);

        if (args.length < command.minArgs || args.length > command.maxArgs) {
            throw new Error(
                `Invalid number of arguments. Usage: ${command.usage}`
            );
        }

        try {
            await command.execute({ args, options });
            return true;
        } catch (error) {
            throw new Error(`Error executing command ${commandName}: ${error.message}`);
        }
    }

    getCommandHelp(commandName) {
        const command = this.commands.get(commandName.toLowerCase());
        if (!command) {
            return null;
        }

        return {
            name: command.name,
            description: command.description,
            usage: command.usage
        };
    }

    listCommands() {
        return Array.from(this.commands.values()).map(cmd => ({
            name: cmd.name,
            description: cmd.description,
            usage: cmd.usage
        }));
    }

    // ===== Utility Methods =====

    static addToken(token, currentOption, args, options) {
        if (currentOption) {
            options[currentOption] = token || true;
        } else if (token) {
            args.push(token);
        }
    }

    static finalizeCurrentToken(current, currentOption, args, options) {
        CommandParser.addToken(current, currentOption, args, options);
    }
}

export default CommandParser;