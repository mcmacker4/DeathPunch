import { Client, Intents } from "discord.js"

import { Config } from "./Config"
import { CommandFactories, registerCommands } from "./commands/commands"

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })

registerCommands().then(() => {

    client.on('interactionCreate', async interaction => {

        if (interaction.isCommand()) {
            await interaction.deferReply()
            try {
                const factory = CommandFactories[interaction.commandName]
                if (factory !== undefined) {
                    await factory(interaction).execute()
                }
            } catch (err: any) {
                interaction.editReply('Error: ' + (err?.message ?? 'unknown'))
                console.error(err.message)
            }
        }
    })

    client.on('ready', async () => console.log("Ready"))

    client.login(Config.token)

}).catch(err => {
    console.error(err)

    console.log('An error ocurred.')
    process.exit(1)
})
