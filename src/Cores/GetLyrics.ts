import { load } from 'cheerio';
import request from 'request';
import { GoogleThisResult } from './Search';

export class GetLyrics {
  public static async getLyrics(options: GoogleThisResult): Promise<Lyrics> {
    const html = await GetLyrics.getHTML(options.url);
    const $ = load(html);

    const result = {
      title: '',
      anime: undefined,
      description: options.description,
      lyrics: [''],
    };

    // @ts-ignore
    $('ul#crumbs > li').each((i, el) => (el.children[0].data ? (result.title = el.children[0].data) : null));
    // @ts-ignore
    $('ul#crumbs > li > a').each((i, el) => (el.children[0].data ? (result.anime = el.children[0].data) : null));

    const centerBox = $('div.centerbox');
    const lyricsTable = centerBox.find('table');

    const lyricsTableIsExist = lyricsTable.length > 0;

    if (!lyricsTableIsExist) {
      centerBox.find('br').each((i, el) => {
        if ((el.next as any)?.data && (el.next as any).data.trim() && this.filterLyrics((el.next as any).data))
          result.lyrics.push((el.next as any).data);
      });
      centerBox.find('dt').each((i, el) => {
        result.lyrics.unshift((el.next as any).data);
      });
    } else {
      result.lyrics = lyricsTable
        .find('td.romaji')
        .text()
        .replace(/Lyrics from Animelyrics.com/g, '')
        .trim()
        .split('\n');
      // split result.lyrics by word with caps lock and \n
      for (let i = 0; i < result.lyrics.length; i++) {
        const ly = result.lyrics[i].trim();
        if (ly.split(' ').some((word) => word.split('').some((char) => char.toUpperCase() === char))) {
          // split by caps letter
          const words = ly.split('');
          for (let j = 0; j < words.length; j++) {
            if (!words[j].match(/[a-zA-Z]/)) continue;
            const word = words[j];
            const prevWord = words[j - 1];
            const nextWord = words[j + 1];

            const isWordCaps = word.toUpperCase() === word;
            const isNextWordCaps = nextWord && nextWord.toUpperCase() === nextWord;

            if (isWordCaps && isNextWordCaps) continue;
            if (prevWord && prevWord.toUpperCase() === prevWord) continue;
            if (prevWord && prevWord.toLowerCase() === prevWord) {
              if (isWordCaps) {
                words[j] = `\n${word}`;
              }
            }
          }
          result.lyrics[i] = words.join('');
        }
      }
    }

    result.lyrics = result.lyrics.map((ly) => ly.trim().replace(/\s+/g, ' ')).filter((ly) => ly.length > 0);

    return result;
  }

  private static filterLyrics(lyrics: string) {
    return (
      !lyrics.includes('<a href=') &&
      !lyrics.includes('Description') &&
      !lyrics.includes('Artist') &&
      !lyrics.includes('Lyrics') &&
      !lyrics.includes('Composition') &&
      !lyrics.includes('Arrangement')
    );
  }

  private static async getHTML(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      request(url, (error, _, body) => {
        if (error) {
          reject(error);
        }
        resolve(body);
      });
    });
  }
}

export interface Lyrics {
  title: string;
  anime?: string;
  description: string;
  lyrics: string[];
}
