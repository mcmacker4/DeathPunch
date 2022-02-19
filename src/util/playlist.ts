import * as ytpl from 'ytpl'


export async function resolvePlaylist(url: string): Promise<string[]> {
    const info = await ytpl(url)
    return info.items.map(item => item.url)
}