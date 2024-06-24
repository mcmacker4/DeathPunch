import { ChatInputCommandInteraction, Guild } from 'discord.js'
import { Routes } from 'discord-api-types/v9'

import { Rest } from '../RestApi'
import { Config } from '../Config'

import { Command } from './Command'

import { EnqueueCommand } from './EnqueueCommand'
import { NextCommand } from './NextCommand'
import { PlayCommand } from './PlayCommand'
import { PauseCommand } from './PauseCommand'
import { UnpauseCommand } from './UnpauseCommand'
import { StopCommand } from './StopCommand'
import { ListCommand } from './ListCommand'


type CommandFactory = (interaction: ChatInputCommandInteraction) => Command
type CommandConstructor<T extends Command> = { new(interaction: ChatInputCommandInteraction, guild: Guild): T }

const commands = [
    PlayCommand,
    PauseCommand,
    UnpauseCommand,
    StopCommand,
    NextCommand,
    EnqueueCommand,
    ListCommand,
] as const;

export async function registerCommands() {
    const builders = commands.map(cmd => cmd.register())

    const names = builders.map(builder => builder.name)
    console.log(`Registering ${names.length} commands: `, names.join(', '))

    const commandData = builders.map(builder => builder.toJSON())

    await Rest.put(
        Routes.applicationCommands(Config.applicationId),
        { body: commandData }
    )
}

export const CommandFactories: Record<string, CommandFactory> = Object.fromEntries(commands.map(cmd => {
    const name = cmd.register().name
    const factory = CommandFactoryFactory(cmd)
    return [name, factory]
}))

function CommandFactoryFactory<T extends Command>(Constructor: CommandConstructor<T>): CommandFactory {
    return (interaction: ChatInputCommandInteraction) => {
        const guild = interaction.guild
        if (guild === null)
            throw new Error('Command is only available in guilds.')
        return new Constructor(interaction, guild)
    }
}
