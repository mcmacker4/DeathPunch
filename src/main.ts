import { Client, Intents } from "discord.js"
import { CommandParser } from "./commands/CommandParser"

import { resolve } from 'path'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })

client.on('messageCreate', message => {
    console.log(`Message: ${message.content}`)
    try {
        const command = CommandParser.parse(message)
        if (command !== undefined) {
            command.execute()
            console.log("Executed:", message.content)
        }
    } catch (err: any) {
        message.reply(err.message)
        console.error(err)
    }
})

client.on('ready', async () => console.log("Ready"))

client.login(loadConfig()['token'])

function loadConfig() {
    return require(resolveConfigPath())
}

function resolveConfigPath()  {
    if (process.argv[2]) {
        return resolve(process.argv[2])
    } else {
        return resolve('./config.json')
    }
}