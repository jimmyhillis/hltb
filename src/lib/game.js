export default class Game {
  constructor(title, times) {
    this.title = title;
    this.times = times || new Map();
  }
  // Return the time (in hours) for provided category
  getTimeFor(category) {
    return this.times.get(category);
  }
}

// Define static references to time categories
// TODO: This should be a constant configuration that could be used
// across the application however const properties are not supported in ES6
Game.prototype.MAIN = 'Main Story';
Game.prototype.EXTRAS = 'Main + Extra';
Game.prototype.COMPLETE = 'Completionist';
Game.prototype.COMBINED = 'Combined';
