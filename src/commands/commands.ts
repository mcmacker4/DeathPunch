import { CommandInteraction, Guild } from 'discord.js'
import { Routes } from 'discord-api-types/v9'

import { Rest } from '../RestApi'
import { Config } from '../Config'

import { Command } from './Command'

import { EnqueueCommand } from './EnqueueCommand'
import { NextCommand } from './NextCommand'
import { PlayCommand } from './PlayCommand'
import { StopCommand } from './StopCommand'


type CommandFactory = (interaction: CommandInteraction) => Command
type CommandConstructor<T extends Command> = { new(interaction: CommandInteraction, guild: Guild): T }

export async function registerCommands() {
    const commandData = [
        PlayCommand.register().toJSON(),
        StopCommand.register().toJSON(),
        NextCommand.register().toJSON(),
        EnqueueCommand.register().toJSON(),
    ]

    await Rest.put(
        Routes.applicationCommands(Config.applicationId),
        { body: commandData }
    )
}

export const CommandFactories: Record<string, CommandFactory> = {
    'play': CommandFactoryFactory(PlayCommand),
    'stop': CommandFactoryFactory(StopCommand),
    'next': CommandFactoryFactory(NextCommand),
    'qadd': CommandFactoryFactory(EnqueueCommand),
}

function CommandFactoryFactory<T extends Command>(Constructor: CommandConstructor<T>): CommandFactory {
    return (interaction: CommandInteraction) => {
        const guild = interaction.guild
        if (guild === null) {
            throw new Error('Command is only available in guilds.')
        }
        return new Constructor(interaction, guild)
    }
}