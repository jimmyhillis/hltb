import * as _request from 'request';
import Xray from 'x-ray';
import Game from './game';

const HLTB_API = 'https://howlongtobeat.com/search_main.php?&page=1';

const replacementExpression = /™|®|-|:|Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ|Ⅵ|Ⅶ|Ⅷ|Ⅸ|Ⅹ|Ⅺ|Ⅻ|Ⅼ|Ⅽ|Ⅾ|Ⅿ/;
const replacer = str => {
  return (
    {
      Ⅰ: 'I',
      Ⅱ: 'II',
      Ⅲ: 'III',
      Ⅳ: 'IV',
      Ⅴ: 'V',
      Ⅵ: 'VI',
      Ⅶ: 'VII',
      Ⅷ: 'VIII',
      Ⅸ: 'IX',
      Ⅹ: 'X',
      Ⅺ: 'XI',
      Ⅻ: 'XII',
      Ⅼ: 'L',
      Ⅽ: 'C',
      Ⅾ: 'D',
      Ⅿ: 'M',
    }[str] || ''
  );
};

// Return a response from the HLTB website
// Example CURL request:
//   curl 'http://howlongtobeat.com/search_main.php?page=1' \
//     --data 'queryString=radiant%20historia&t=games&sorthead=popular' \
//     --data '&sortd=Normal Order&plat=&detail=0'
// @param {string} search String to search
// @param {callback} Function to pass success or error
function request(searchString, callback) {
  // Remove characters known to break games on HLTB searches
  const queryString = searchString.replace(replacementExpression, replacer);
  const form = {
    queryString,
    t: 'games',
    sorthead: 'popular',
    sortd: 'Normal Order',
    plat: '',
    length_type: 'main',
    detail: 0,
  };
  return _request.post(HLTB_API, { form }, callback);
}

// Converts an array of [key, value, key, value] length scores
// into a usable object of { key: value } where value is the number
// of minutes or `null` when unknown
// @param {[string]} items Consective array of [key, value, key, value ...]
function parseTimes(items) {
  const pairs = new Map();
  while (items.length) {
    if (items.length < 2) {
      break;
    }
    const [label = '', timePortion = ''] = items.splice(0, 2);
    let minutes;
    // convert timePortion string into minutes
    if (timePortion.toLowerCase().indexOf('hours') > -1) {
      const [hours, ...junk] = timePortion.split(' ');
      if (hours.indexOf('½') > -1) {
        minutes = parseInt(hours.replace(/½/, ''), 10) * 60 + 30;
      } else {
        minutes = parseInt(hours, 10) * 60;
      }
    } else if (timePortion.toLowerCase().indexOf('mins') > -1) {
      minutes = parseInt(timePortion.split(' ').shift(), 10);
    } else {
      // TODO add support for logging a wraning
      // console.warn(`Found a time that cannot be parsed ${timePortion}`);
    }
    pairs.set(label, minutes);
  }
  return pairs;
}

// Scrape HLTB HTML and return a Game with correct values
// @param {string} html to parse and map to Game objects
// @param {callback} Function to pass success or error
function scrapeData(html, callback) {
  const xray = new Xray();
  const scraper = xray(html, '.search_list_details', [
    {
      title: 'h3',
      scores: ['.search_list_tidbit'],
    },
  ]);
  scraper((err, data) => {
    if (err) {
      return callback(err);
    }
    return callback(
      null,
      data.map(item => {
        return new Game(item.title, parseTimes(item.scores));
      })
    );
  });
}

export function search(game, callback) {
  request(game, (err, response) => {
    if (err) {
      return callback(err);
    }
    return scrapeData(response.body, callback);
  });
}
