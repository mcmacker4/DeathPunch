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
import { CommandInteraction, Guild, TextBasedChannel } from "discord.js"
import * as ytdl from "ytdl-core"
import { Readable } from 'stream'

export type Song = {
    title: string
    url: string
}

export class PlaySession {

    readonly queue: Song[] = []

    private currentStream?: Readable

    private disconnectCallback?: () => void

    private constructor(
        readonly voiceChannelId: string,
        private readonly textChannel: TextBasedChannel,
        private readonly connection: VoiceConnection,
        private readonly audioPlayer: AudioPlayer,
        private readonly subscription: PlayerSubscription
    ) {
        this.registerListeners()
    }

    private registerListeners() {
        this.audioPlayer.on('stateChange', (_, state) => {
            console.log(`${this.voiceChannelId} player state changed ${state.status}`)
            if (state.status === AudioPlayerStatus.Idle) {
                this.currentStream?.destroy()
                this.playNext()
            }
        })

        this.connection.on('stateChange', (_, state) => {
            console.log(`${this.voiceChannelId} connection state changed ${state.status}`)
            if (state.status === VoiceConnectionStatus.Disconnected) {
                this.disconnectCallback?.call(null)
            }
        })
    }

    enqueue(...songs: Song[]) {
        this.queue.push(...songs)
    }

    enqueueFirst(...songs: Song[]) {
        this.queue.unshift(...songs)
    }

    playNext() {
        const url = this.queue.shift()
        if (url !== undefined) {
            this.audioPlayer.stop()
            this.currentStream?.destroy()
            this.playNow(url)
        }
    }

    playNow(song: Song) {
        console.log(`${this.voiceChannelId} playing song now`)

        this.textChannel.send(`Now playing \`${song.title}\``).catch((err) => console.error(err))

        this.currentStream = ytdl(song.url, {
            filter: 'audioonly',
            highWaterMark: 1 << 25
        })

        const resource = createAudioResource(this.currentStream)
        this.audioPlayer.play(resource)
    }

    destroy() {
        console.log(`${this.voiceChannelId} being destroyed`)
        this.audioPlayer.stop()
        this.subscription?.unsubscribe()
        this.connection.destroy()
    }

    onDisconnect(callback: typeof this.disconnectCallback) {
        this.disconnectCallback = callback
    }

    static create(guild: Guild, textChannel: TextBasedChannel, voiceChannelId: string) {
        const connection = joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        })

        const audioPlayer = createAudioPlayer()
        const subscription = connection.subscribe(audioPlayer)

        if (subscription === undefined) {
            throw new Error("Could not subscribe to audio player.")
        }

        return new PlaySession(voiceChannelId, textChannel, connection, audioPlayer, subscription)
    }

}