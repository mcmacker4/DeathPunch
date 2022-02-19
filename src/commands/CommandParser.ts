import { Message } from "discord.js";
import { Command } from "./Command";
import { EnqueueCommand } from "./EnqueueCommand";
import { NextCommand } from "./NextCommand";
import { PlayCommand } from "./PlayCommand";
import { StopCommand } from "./StopCommand";


const COMMAND_PREFIX = '?'

function cmd(name: string): string {
    return COMMAND_PREFIX + name
}

export class CommandParser {

    private constructor() {}

    static parse(message: Message): Command | undefined {
        if (!message.guild) {
            message.reply('I only work on servers.')
            return
        }

        const text = message.content.trim()

        if (!text.startsWith(COMMAND_PREFIX)) {
            return
        }

        const args = text.split(/\s+/)
        const name = args.shift()

        if (name === cmd('play')) {
            console.log(`Message is a PlayCommand`)
            return new PlayCommand(message, message.guild, args)
        } else if (name === cmd('stop')) {
            console.log(`Message is a StopCommand`)
            return new StopCommand(message, message.guild)
        } else if (name === cmd('next')) {
            return new NextCommand(message, message.guild)
        } else if (name === cmd('qadd')) {
            return new EnqueueCommand(message, message.guild, args)
        }
    }


}