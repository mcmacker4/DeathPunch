import { REST } from "discord.js";
import { Config } from "./Config";

export const Rest = new REST().setToken(Config.token)
