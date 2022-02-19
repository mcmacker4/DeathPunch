import { PlayService } from "../PlayService";
import { Command } from "./Command";


export class StopCommand extends Command {

    async execute() {
        PlayService.endSession(this.guild.id)
    }

}