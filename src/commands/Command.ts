import { ChatInputCommandInteraction, Guild } from "discord.js";


export abstract class Command {

    constructor(
        readonly interaction: ChatInputCommandInteraction,
        readonly guild: Guild,
    ) {}

    abstract execute(): Promise<void>

}
