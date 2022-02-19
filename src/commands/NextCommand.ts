import { PlayService } from "../PlayService";
import { Command } from "./Command";


export class NextCommand extends Command {

    async execute() {
        
        const session = PlayService.findSession(this.guild.id)

        if (session !== undefined) {
            session.playNext()
        }

    }

}