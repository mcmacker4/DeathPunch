import { CommandInteraction, Guild, Interaction, Message } from "discord.js";


export abstract class Command {

    constructor(
        readonly interaction: CommandInteraction,
        readonly guild: Guild,
    ) {}

    abstract execute(): Promise<void>

}