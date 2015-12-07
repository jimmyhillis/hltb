import request from 'request';
import Xray from 'x-ray';

const HLTB_API = 'http://howlongtobeat.com/search_main.php?&page=1';

class Game {
  constructor(title, times) {
    this.title = title;
    this.times = times || [];
  }
  // Return the time (in hours) for provided category
  getTimeFor(category) {
    return this.times[category] || null;
  }
}

// Define static references to time categories
// TODO: This should be a constant configuration that could be used
// across the application however const properties are not supported in ES6
Game.prototype.MAIN = 'Main Story';
Game.prototype.EXTRAS = 'Main + Extra';
Game.prototype.COMPLETE = 'Completionist';
Game.prototype.COMBINED = 'Combined';

// Return a response from the HLTB website
// Example CURL request:
//   curl 'http://howlongtobeat.com/search_main.php?page=1' \
//     --data 'queryString=radiant%20historia&t=games&sorthead=popular&sortd=Normal Order&plat=&detail=0'
// @param {string} search String to search
// @param {callback} Function to pass success or error
function apiRequest(search, callback) {
  const formData = {
    queryString: search,
    t: 'games',
    sorthead: 'popular',
    sortd: 'Normal Order',
    plat: '',
    detail: 0,
  };
  return request.post(HLTB_API, { form: formData }, callback);
}

// Converts an array of [key, value, key, value] length scores
// into a usable object of { key: value } where value is the number
// of minutes or `null` when unknown
// @param {[string]} items Consective array of [key, value, key, value ...]
function parseTimes(items) {
  const pairs = {};
  while (items.length) {
    if (items.length < 2) {
      break;
    }
    const pair = items.splice(0, 2);
    pairs[pair[0]] = pair[1];
  }
  return pairs;
}

// Scrape HLTB HTML and return a Game with correct values
// @param {string} html to parse and map to Game objects
// @param {callback} Function to pass success or error
function scrapeData(html, callback) {
  const xray = new Xray();
  const scraper = xray(html, '.search_list_details', [{
    title: 'h3',
    scores: ['.search_list_tidbit'],
  }]);
  scraper((err, data) => {
    if (err) {
      return callback(err);
    }
    return callback(null, data.map(item => {
      return new Game(item.title, parseTimes(item.scores));
    }));
  });
}

export default class HLTB {
  static search(game, callback) {
    apiRequest(game, (err, response) => {
      if (err) {
        return callback(err);
      }
      return scrapeData(response.body, callback);
    });
  }
}
