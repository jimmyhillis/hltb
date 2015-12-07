export default class Game {
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
