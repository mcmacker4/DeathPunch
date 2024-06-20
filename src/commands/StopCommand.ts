import { SlashCommandBuilder } from "@discordjs/builders";
import { PlayService } from "../PlayService";
import { Command } from "./Command";


export class StopCommand extends Command {

    static register() {
        return new SlashCommandBuilder()
            .setName('stop')
            .setDescription('Stops the music and removes the bot from the voice channel.')
    }

    async execute() {
        PlayService.endSession(this.guild.id)
        this.interaction.editReply('Session ended!')
    }

}
