import * as ytdl from "ytdl-core"
import * as ytpl from "ytpl"

export function isPlaylistUrl(text: string) {
    return ytpl.validateID(text)
}

export function isVideoUrl(text: string) {
    return ytdl.validateURL(text)
}