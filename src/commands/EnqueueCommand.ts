import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { PlayService } from "../PlayService";
import { resolvePlaylist } from "../util/playlist";
import { isPlaylistUrl, isVideoUrl } from "../util/validators";
import { Command } from "./Command";


export class EnqueueCommand extends Command {

    static register() {
        return new SlashCommandBuilder()
            .setName('qadd')
            .setDescription('Add song/playlist to the queue')
            .addStringOption(option => 
                option.setName('url')
                    .setDescription('YouTube video/playlist url.')
                    .setRequired(true)
            )
    }

    async execute() {

        const session = PlayService.findSession(this.guild.id)

        const url = this.interaction.options.getString('url')

        if (url === null) {
            throw new Error('Pleasb specify a URL')
        }

        if (session !== undefined) {

            if (isPlaylistUrl(url)) {
                console.log(`EnqueueCommand: message is a playlist url`)
                try {
                    const playlistInfo = await resolvePlaylist(url)
                    const count = playlistInfo.urls.length
                    session.enqueue(...playlistInfo.urls)
                    this.interaction.editReply(`Added ${count} song${count === 1 ? '' : 's'} from \`${playlistInfo.title}\``)
                } catch (err) {
                    console.error(err)
                    throw new Error('An error ocurred resolving the playlist.')
                }
            } else if (isVideoUrl(url)) {
                console.log(`EnqueueCommand: message is a video url`)
                session.enqueue(url)
                await this.interaction.editReply(`Added 1 song to the queue`)
            } else {
                throw new Error('Invalid URL')
            }
            
        }

    }

}