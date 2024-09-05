import * as ytdl from "@distube/ytdl-core"

export function isVideoUrl(text: string) {
    return ytdl.validateURL(text)
}
