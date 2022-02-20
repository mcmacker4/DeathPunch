import * as ytpl from 'ytpl'
import { Song } from '../PlaySession'


export async function resolvePlaylist(url: string): Promise<{ title: string, songs: Song[] }> {
    const info = await ytpl(url)
    return {
        title: info.title,
        songs: info.items.map(item => ({
            title: item.title,
            url: item.url
        })),
    }
}