import { search } from 'googlethis';

export class Search {
  protected static readonly searchOptions = {
    page: 0,
    safe: false,
    additional_params: { hl: 'en' },
  };

  public static async search(query: string): Promise<GoogleThisResult[]> {
    return new Promise(async (resolve, reject) => {
      let { results } = await search(`site:www.animelyrics.com ${query}`, this.searchOptions);
      results = results.filter((result) => result.url.includes('animelyrics.com') && result.url.endsWith('.htm'));
      if (results.length === 0) reject('No results found');
      resolve(results);
    });
  }
}

export interface GoogleThisResult {
  title: string;
  description: string;
  url: string;
  favicons: {
    high_res: string;
    low_res: string;
  };
}
