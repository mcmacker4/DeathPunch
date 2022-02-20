import { SlashCommandBuilder } from "@discordjs/builders";
import { PlayService } from "../PlayService";
import { Command } from "./Command";


export class NextCommand extends Command {

    static register() {
        return new SlashCommandBuilder()
            .setName('next')
            .setDescription('Skip to the next song in the queue.')
    }

    async execute() {
        const session = PlayService.findSession(this.guild.id)
        if (session !== undefined) {
            session.playNext()
            this.interaction.editReply('Playing next song.')
        }
    }

}