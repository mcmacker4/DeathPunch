import { Command } from "./Command";

import { isPlaylistUrl, isVideoUrl } from "../util/validators";
import { resolvePlaylist } from "../util/playlist";
import { PlaySession } from "../PlaySession";
import { PlayService } from "../PlayService";

export class PlayCommand extends Command {

    async execute() {

        const channelId = this.getChannelId()

        if (channelId === undefined) {
            throw new Error('You are not in a voice channel')
        }

        const url = this.args[0]

        if (!url) {
            throw new Error('Please specify a URL')
        }

        const session = this.findOrCreateSession(channelId)

        if (isPlaylistUrl(url)) {
            console.log(`PlayCommand: message is a playlist url`)
            try {
                const allUrls = await resolvePlaylist(url)
                session.enqueue(...allUrls)
                session.playNext()
            } catch (err) {
                console.error(err)
                throw new Error('An error ocurred resolving the playlist.')
            }
        } else if (isVideoUrl(url)) {
            console.log(`PlayCommand: message is a video url`)
            session.playNow(url)
        } else {
            throw new Error('Invalid URL')
        }

    }

    private findOrCreateSession(channelId: string): PlaySession {
        const textChannel = this.message.channel
        if (textChannel.isText()) {
            const session = PlayService.findSession(this.guild.id) ?? PlayService.createSession(this.guild, textChannel, channelId)
            if (session.voiceChannelId !== channelId)
                throw new Error('A session is playing in another channel')
            return session
        } else {
            throw new Error('Message was not sent in a regular Text Channel')
        }
    }

    private getChannelId(): string | undefined {
        const member = this.message.member
        if (member !== null) {
            return member.voice.channelId ?? undefined
        }
    }

}