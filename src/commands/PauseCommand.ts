import { SlashCommandBuilder } from "@discordjs/builders";
import { PlayService } from "../PlayService";
import { Command } from "./Command";


export class PauseCommand extends Command {

    static register() {
        return new SlashCommandBuilder()
            .setName('pause')
            .setDescription('Pauses whatever is playing.')
    }

    async execute() {
        const session = PlayService.findSession(this.guild.id)
        if (session) {
            session.pause()
            this.interaction.editReply('Paused!')
        } else {
            this.interaction.editReply('Nothing is playing')
        }
    }

}
