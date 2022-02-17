import { Client, Intents, Message } from 'discord.js'
import { AudioPlayer, createAudioPlayer, createAudioResource, joinVoiceChannel, PlayerSubscription, VoiceConnection } from '@discordjs/voice'
import { URL } from 'url'

import { resolve } from 'path'
import * as ytdl from 'ytdl-core'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })

interface PlaySession {
    channelId: string
    songQueue: string[]
    
    connection: VoiceConnection
    subscription: PlayerSubscription
    player: AudioPlayer
}

const sessions = new Map<string, PlaySession>();

function getVoiceChannelId(message: Message) {
    return message.member?.voice.channelId
}

function playMusic(session: PlaySession, url: string) {
    const resource = createAudioResource(ytdl(url))
    session.player.play(resource)
}

function playInNewSession(message: Message, url: string) {

    const channelId = getVoiceChannelId(message)

    if (!channelId || !message.guildId || !message.guild) {
        throw new Error("Channel id or guild are null")
    }

    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: message.guildId,
        adapterCreator: message.guild.voiceAdapterCreator,
    })

    const player = createAudioPlayer()
    const subscription = connection.subscribe(player)

    if (!subscription) {
        throw new Error("Could not subscribe")
    }

    const session: PlaySession = {
        channelId: channelId,
        songQueue: [],
        connection,
        player,
        subscription,
    }
    
    sessions.set(channelId, session)

    playMusic(session, url)

}

function playInExistingSession(message: Message, url: string) {
    const channelId = getVoiceChannelId(message)

    if (!channelId) {
        throw new Error("ChannelId is null")
    }

    const session = sessions.get(channelId)

    if (!session) {
        throw new Error("Session not found")
    }

    playMusic(session, url)
}

function parseUrl(message: Message) {
    return message.content.split(/\s+/)[1]
}

function isValidUrl(url: string) {
    try {
        new URL(url)
        return true
    } catch (_) {}
    return false
}

function playInSession(message: Message) {
    const channelId = getVoiceChannelId(message)

    if (!channelId) {
        throw new Error("ChannelId is null")
    }

    const url = parseUrl(message)
    if (!isValidUrl(url)) {
        message.reply("Invalid URL")
        console.log("URL: ", url)
        return
    }

    if (sessions.has(channelId)) {
        playInExistingSession(message, url)
    } else {
        playInNewSession(message, url)
    }
}

function stopPlaySession(message: Message) {
    const channelId = getVoiceChannelId(message)

    if (!channelId) {
        throw new Error("ChannelId is null")
    }

    const session = sessions.get(channelId)

    if (session) {
        session.player.stop()
        session.subscription.unsubscribe()
        session.connection.disconnect()
        session.connection.destroy()

        sessions.delete(channelId)
    }
}

client.on('messageCreate', message => {
    const content = message.content.trim()
    console.log(content)
    try {
        if (content.startsWith('?play')) {
            playInSession(message)
        } else if (content.startsWith('?stop')) {
            stopPlaySession(message)
        }
    } catch (e) {
        console.error(e)
    }
})

client.on('ready', async () => console.log("Ready"))

const config = require(resolve(process.cwd(), 'config.json'))
client.login(config['token'])