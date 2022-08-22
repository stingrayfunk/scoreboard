# Scoreboard

A simple JavaScript library for managing the scores of live football games.

## Installation

(Provide instructions on installing the NPM package if it were published. Any other dependencies needed, NodeJS etc...)

## Usage

```
import { Scoreboard } from 'scoreboard';

const worldCup = new Scoreboard();

worldCup.startGame('France', 'Germany');
worldCup.startGame('Brazil', 'Spain');
worldCup.startGame('Argentina', 'Chile');

worldCup.updateScore('France', 'Germany', 2, 3);
worldCup.updateScore('Brazil', 'Spain', 4, 2);
worldCup.updateScore('Argentina', 'Chile', 1, 1);

worldCup.finishGame('Brazil', 'Spain');

/* Prints the following:
 * France 2 - Germany 3
 * Argentina 1 - Chile 1
 */
console.log(worldCup.liveBoard());

/* Returns an array of objects of the form:
 * {
 *   gameId: String
 *   kickOff: Number
 *   homeTeam: String,
 *   awayTeam: String,
 *   score: [Number, Number],
 *  }
 */
const scores = worldCup.liveScores();
```

## Considerations

### Test Driven Development

The tests were written first before any code was written. This was very useful given the number of scenarios and edge cases. Further tests were added later during implementation as I thought of more edge cases.

### Implemtnation Approach

There were a number of approaches considered:

1. A simple set of functions in a JavaScript module with a shared array of scores scoped at the module level. This would have been fine, except it would not have allowed multiple instances of the scoreboard. The instance would've been created upon importing the scoreboard module as the scores array would be created at the module level.

2. Closure approach (OOP). All variables and functions could have been captured in a closure. However this approach would not have yielded any benefits apart from privatising certain methods and fields, which can be done with a class anyway. It would also be verbose compared to the class or function prototype approaches.

3. Functional programming approach (FP). One could write a set of functions to handle everything. However, the scores array would need to be passed to each function to make them pure. This would mean the consumer of the library would have to deal with the scores array, killing the encapsulation and giving them unnecessary work to do. Ultimately, we're dealing with shared data across various operations, so an OOP approach is prefered.

4. Proptotype function approach (OOP). This would be fine, however the class syntax was prefered (see point 5 below).

5. JavaScript class approach (OOP). This is the path I ultimately took. It allows multiple instances of the scoreboard and utilises clear class-based syntax for private fields and methods.

### Immutability

There are JS libraries that help force immutability (ImmutableJS and Immer, for example). There are also libraries like Redux to assist in uni-directional flow of updates and immutability. However, it was felt that such libraries were overkill here. This is a shared data OOP solution and the scores array is not mutable by the consumer, which is the main thing here. A copy of the array is always returned, never the original.

### Other Notes

1. I didn't have time to get building the library working. I had added the Webpack config but had yet to correctly generate the bundle.
2. The teams array is not exposed to the user but probably would be. Or there would be a way for the user to pass in the teams array, perhaps in the scoreboard instance creation (as an argument to the constructor).
3. I originally required `updateScore()` to take the `gameId` for the game lookup (I was returning the game object from `startGame()` so that the user had the `gameId`). However, I changed `updateScore()` to take the team names instead, reducing what the consumer has to deal with to what they already know.
4. Error strings could be abstracted into a language file, making localisation easy if it were required.
5. I have assumed that any game on the score board is in progress, regardless of how long it has been there.
6. Did not have time to write a proper README of what the functions do, explaining the sort order of the returned scores, etc.
