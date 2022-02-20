import { resolve } from 'path'

type BotConfig = {
    token: string
    applicationId: string
}

const defaultPath = process.cwd() + '/config.json'
const path = resolve(process.argv[2] ?? defaultPath)

export const Config: BotConfig = require(path)