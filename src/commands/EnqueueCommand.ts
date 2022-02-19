import { PlayService } from "../PlayService";
import { resolvePlaylist } from "../util/playlist";
import { isPlaylistUrl, isVideoUrl } from "../util/validators";
import { Command } from "./Command";


export class EnqueueCommand extends Command {

    async execute() {

        const url = this.args[0]

        if (!url) {
            throw new Error('Please specify a URL')
        }

        const session = PlayService.findSession(this.guild.id)

        if (session !== undefined) {

            if (isPlaylistUrl(url)) {
                console.log(`EnqueueCommand: message is a playlist url`)
                try {
                    const allUrls = await resolvePlaylist(url)
                    session.enqueue(...allUrls)
                } catch (err) {
                    console.error(err)
                    throw new Error('An error ocurred resolving the playlist.')
                }
            } else if (isVideoUrl(url)) {
                console.log(`EnqueueCommand: message is a video url`)
                session.enqueue(url)
            } else {
                throw new Error('Invalid URL')
            }
            
        }

    }

}