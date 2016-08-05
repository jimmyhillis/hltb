#!/usr/bin/env node

import minimist from 'minimist';
import HLTB from '../lib/hltb';

const argv = minimist(process.argv.slice(2));
const gameSearch = argv.game || argv._[0];

if (!gameSearch) {
  console.error('Provide a game to search');
  process.exit(1);
}

HLTB.search(gameSearch, (err, games) => {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  return games.forEach((game) => {
    console.log(`${game.title} is ${game.getTimeFor(game.MAIN)} minutes`);
  });
});
