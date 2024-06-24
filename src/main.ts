import { Client, GatewayIntentBits, Events } from "discord.js"

import { Config } from "./Config"
import { CommandFactories } from "./commands/commands"


async function main() {

    const client = new Client({ intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates })

    client.on(Events.InteractionCreate, async interaction => {

        if (interaction.isChatInputCommand()) {
            await interaction.deferReply()
            try {
                const factory = CommandFactories[interaction.commandName]
                if (factory !== undefined)
                    await factory(interaction).execute()
            } catch (err: any) {
                interaction.editReply('Error: ' + (err?.message ?? 'unknown'))
                console.error(err.message)
            }
        }
    })

    client.on(Events.ClientReady, async () => console.log("Ready"))

    await client.login(Config.token)

}

main()
