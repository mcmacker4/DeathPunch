import { Command } from "./Command";

import { isPlaylistUrl, isVideoUrl } from "../util/validators";
import { resolvePlaylist } from "../util/playlist";
import { PlaySession } from "../PlaySession";
import { PlayService } from "../PlayService";
import { SlashCommandBuilder } from "@discordjs/builders";

export class PlayCommand extends Command {

    static register() {
        return new SlashCommandBuilder()
            .setName('play')
            .setDescription('Play a song in your current voice channel')
            .addStringOption(option =>
                option.setName('url')
                    .setDescription('YouTube video/playlist URL')
                    .setRequired(true))
    }

    async execute() {

        const channelId = this.getChannelId()

        if (channelId === undefined) {
            throw new Error('You are not in a voice channel')
        }

        const url = this.interaction.options.getString('url')

        if (url === null) {
            throw new Error('Please specify a URL')
        }

        const session = this.findOrCreateSession(channelId)

        if (isPlaylistUrl(url)) {
            try {
                const allUrls = await resolvePlaylist(url)
                session.enqueueFirst(...allUrls)
                session.playNext()
                this.interaction.editReply('Playing playlist now.')
            } catch (err) {
                console.error(err)
                throw new Error('An error ocurred resolving the playlist.')
            }
        } else if (isVideoUrl(url)) {
            session.playNow(url)
            this.interaction.editReply('Playing song now.')
        } else {
            throw new Error('Invalid URL')
        }

    }

    private findOrCreateSession(channelId: string): PlaySession {
        const textChannel = this.interaction.channel
        if (textChannel !== null && textChannel.isText()) {
            const session = PlayService.findSession(this.guild.id) ?? PlayService.createSession(this.guild, textChannel, channelId)
            if (session.voiceChannelId !== channelId)
                throw new Error('A session is playing in another channel')
            return session
        } else {
            throw new Error('Message was not sent in a regular Text Channel')
        }
    }

    private getChannelId(): string | undefined {
        const member = this.interaction.member
        if (member !== null && 'voice' in member) {
            return member.voice.channelId ?? undefined
        }
    }

}