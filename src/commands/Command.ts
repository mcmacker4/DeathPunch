import { Guild, Message } from "discord.js";


export abstract class Command {

    constructor(
        readonly message: Message,
        readonly guild: Guild,
        readonly argumens: string[] = []
    ) {}

    abstract execute(): Promise<void>
    
}