# HLTB

A javascript (node + browser) module for pulling time data from [HLTB](http://howlongtobeat.com).

## Usage

To use the API within your code you can use `#search` to return all the games that match the provided string, with access to each time.

```
import HLTB from '../lib/hltb';

HLTB.search({{game title}}, (err, games) => {
  console.log(`we found ${games.length} matching games`);
  games.forEach((game) => {
    console.log(games.getTimeForGame(game.MAIN));
  })
})
```

You can get the different HLTB times with the following constants:

- MAIN
- EXTRAS
- COMPLETE
- COMBINED

Each time returned is in minutes.

## CLI

A CLI is also available for quickly searching users data to use in your shell.

```bash
# return all games belonging to {{username}} in JSON format
npm run cli {{game title}}
```

# License

MIT
