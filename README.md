# animelyrics-scraper
Is a project that helps weebs to get their favorite song lyrics. Very useful if you needs it. Scraps from https://www.animelyrics.com/

## Installation
> npm i animelyrics-scraper

## ⚠ Warning
- This module is not sponsored, affiliated, and supported by google and animelyrics
- This module is heavily using scraping methods from searching to get the lyrics. One day, one year, one decade, the website might change their site and this module will break. But don't worry it works for now ✌   
   
    

Docs? meh example below will cover everything
## Example
```js
const { Search, GetLyrics } = require('../dist/index'); // CommonJS
import { Search, GetLyrics } from '../dist/index'; // ES6

// search the song by Search.search('title')
// Get the lyrics by GetLyrics.getLyrics(the result from search)
// 
// don't forget to catch in every function to prevent unexpected error

Search.search("maware").then(results => {
    const result = results[0];
    GetLyrics.getLyrics(result).then(console.log)
}).catch(_ => console.log('No lyrics was found'));
```