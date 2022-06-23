const { Search, GetLyrics } = require("../dist/index");

Search.search("maware").then(results => {
    const result = results[0];
    GetLyrics.getLyrics(result).then(console.log)
});