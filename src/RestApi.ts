import { REST } from "@discordjs/rest";
import { Config } from "./Config";

export const Rest = new REST({ version: '9' }).setToken(Config.token)