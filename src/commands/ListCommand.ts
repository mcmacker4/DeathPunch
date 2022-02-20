import { SlashCommandBuilder } from "@discordjs/builders";
import { PlayService } from "../PlayService";
import { Command } from "./Command";


export class ListCommand extends Command {

    static register() {
        return new SlashCommandBuilder()
            .setName('list')
            .setDescription('Show songs in queue')
    }

    async execute() {
        const session = PlayService.findSession(this.guild.id)
        if (session !== undefined) {
            const titles = session.queue.slice(0, 5).map(it => it.title)
            let message = 'Following songs in the queue:\n```' +
                titles.map(title => `- ${title}`)
                    .join('\n')
            if (session.queue.length - 5 > 0) {
                message += `\n(and ${session.queue.length - 5} more)`
            }
            message += '```'
            this.interaction.editReply(message)
        } else {
            this.interaction.editReply('No session active')
        }
    }

}