import { Guild, TextBasedChannel } from "discord.js";
import { PlaySession } from "./PlaySession";


export class PlayService {

    private static repository = new Map<string, PlaySession>()

    private constructor() {}

    public static findSession(guildId: string): PlaySession | undefined {
        return this.repository.get(guildId)
    }

    public static createSession(guild: Guild, textChannel: TextBasedChannel, channelId: string): PlaySession {
        const session = PlaySession.create(guild, textChannel, channelId)
        this.repository.set(guild.id, session)
        return session
    }

    public static endSession(guildId: string) {
        const session = this.repository.get(guildId)
        if (session !== undefined) {
            console.log(`${session.voiceChannelId} Ending session on guild ${guildId}`)
            session.destroy()
            this.repository.delete(guildId)
        }
    }

}
