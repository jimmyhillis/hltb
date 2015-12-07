const minimist = require('minimist');
const HLTB = require('../dist/hltb').default;
const argv = minimist(process.argv.slice(2));
const gameSearch = argv.game || argv._[0];

if (gameSearch === null) {
  console.error('Please provide a game to search');
  process.exit(1);
}

HLTB.search(gameSearch, function (err, games) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  return games.forEach(function (game) {
    console.log(game.title, 'is', game.getTimeFor(game.MAIN));
  });
});
