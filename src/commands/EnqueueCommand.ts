import { SlashCommandBuilder } from "@discordjs/builders";
import * as ytdl from "ytdl-core";
import { PlayService } from "../PlayService";
import { isVideoUrl } from "../util/validators";
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

            if (isVideoUrl(url)) {

                try {
                    const info = await ytdl.getBasicInfo(url)
                    session.enqueue({
                        title: info.videoDetails.title,
                        url
                    })
                    await this.interaction.editReply(`Added \`${info.videoDetails.title}\` to the queue`)
                } catch (err) {
                    console.error(err)
                    throw new Error('An error ocurred resolving the video info.')
                }

            } else {
                throw new Error('Invalid URL')
            }
            
        }

    }

}
