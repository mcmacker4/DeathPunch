import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    PlayerSubscription,
    VoiceConnection,
    VoiceConnectionStatus
} from "@discordjs/voice"
import { Guild } from "discord.js"
import * as ytdl from "ytdl-core"

export class PlaySession {

    private queue: string[] = []

    private disconnectCallback?: () => void

    private constructor(
        readonly channelId: string,
        private readonly connection: VoiceConnection,
        private readonly audioPlayer: AudioPlayer,
        private readonly subscription: PlayerSubscription
    ) {
        this.registerListeners()
    }

    private registerListeners() {
        this.audioPlayer.on('stateChange', (_, state) => {
            console.log(`${this.channelId} player state changed ${state.status}`)
            if (state.status === AudioPlayerStatus.Idle) {
                this.playNext()
            }
        })

        this.connection.on('stateChange', (_, state) => {
            console.log(`${this.channelId} connection state changed ${state.status}`)
            if (state.status === VoiceConnectionStatus.Disconnected) {
                this.disconnectCallback?.call(null)
            }
        })
    }

    enqueue(...urls: string[]) {
        this.queue.push(...urls)
    }

    playNext() {
        console.log(`${this.channelId} playing next song.`)
        const url = this.queue.shift()
        if (url !== undefined) {
            this.playNow(url)
        }
    }

    playNow(url: string) {
        console.log(`${this.channelId} playing song now`)
        const stream = ytdl(url)
        const resource = createAudioResource(stream)
        this.audioPlayer.play(resource)
    }

    destroy() {
        console.log(`${this.channelId} being destroyed`)
        this.audioPlayer.stop()
        this.subscription?.unsubscribe()
        this.connection.destroy()
    }

    onDisconnect(callback: typeof this.disconnectCallback) {
        this.disconnectCallback = callback
    }

    static create(guild: Guild, channelId: string) {
        const connection = joinVoiceChannel({
            channelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        })

        const audioPlayer = createAudioPlayer()
        const subscription = connection.subscribe(audioPlayer)

        if (subscription === undefined) {
            throw new Error("Could not subscribe to audio player.")
        }

        return new PlaySession(channelId, connection, audioPlayer, subscription)
    }

}