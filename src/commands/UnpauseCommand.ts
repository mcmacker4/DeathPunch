import { SlashCommandBuilder } from "@discordjs/builders";
import { PlayService } from "../PlayService";
import { Command } from "./Command";


export class UnpauseCommand extends Command {

    static register() {
        return new SlashCommandBuilder()
            .setName('unpause')
            .setDescription('Unpauses a paused session')
    }

    async execute() {
        const session = PlayService.findSession(this.guild.id)
        if (session) {
            session.unpause()
            this.interaction.editReply('Unpaused!')
        } else {
            this.interaction.editReply('There is nothing to unpause')
        }
    }

}
