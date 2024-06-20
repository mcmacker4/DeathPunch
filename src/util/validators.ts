import * as ytdl from "ytdl-core"

export function isVideoUrl(text: string) {
    return ytdl.validateURL(text)
}
