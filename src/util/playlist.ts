import * as ytpl from 'ytpl'


export async function resolvePlaylist(url: string): Promise<{ title: string, urls: string[] }> {
    const info = await ytpl(url)
    return {
        title: info.title,
        urls: info.items.map(item => item.url),
    }
}