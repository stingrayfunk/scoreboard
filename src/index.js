import { v4 as uuid } from "uuid";

const isString = (value) => value && typeof value === "string";
const isValidScore = (value) => Number.isInteger(value) && value >= 0;

const teams = [
  "Argentina",
  "Germany",
  "France",
  "Spain",
  "Brazil",
  "Uruguay",
  "Italy",
  "Australia",
  "Mexico",
  "Canada",
];

export class Scoreboard {
  #scores;

  constructor() {
    this.#scores = [];
  }

  /**
   * Returns the index of the game in scores array, or -1.
   *
   * @param {String} homeTeam
   * @param {String} awayTeam
   * @returns {Boolean}
   */
  #getGameIndex(homeTeam, awayTeam) {
    return this.#scores.findIndex(
      (game) => game.homeTeam === homeTeam && game.awayTeam === awayTeam
    );
  }

  /**
   * Return whether or not a team is already playing a game.
   *
   * @param {String} team
   * @returns {Boolean}
   */
  #isTeamPlaying(team) {
    return (
      this.#scores.findIndex(
        (game) => game.homeTeam === team || game.awayTeam === team
      ) !== -1
    );
  }

  /**
   * Return whether or not a game is currently in play.
   *
   * @param {String} homeTeam
   * @param {String} awayTeam
   * @returns {Boolean}
   */
  #isGameInPlay(homeTeam, awayTeam) {
    return this.#getGameIndex(homeTeam, awayTeam) !== -1;
  }

  /**
   * Start a new game with two teams, score 0 0.
   *
   * @param {string} homeTeam
   * @param {string} awayTeam
   * @returns {object} Game details object
   */
  startGame(homeTeam, awayTeam) {
    if (!isString(homeTeam) || !isString(awayTeam)) {
      throw new Error("Expected home and away team names as strings");
    }
    if (!teams.includes(homeTeam) || !teams.includes(awayTeam)) {
      throw new Error("At least one team provided does not exist");
    }
    if (this.#isGameInPlay(homeTeam, awayTeam)) {
      throw new Error("This game is already in play");
    }
    if (this.#isTeamPlaying(homeTeam)) {
      throw new Error(`${homeTeam} is already playing a game`);
    }
    if (this.#isTeamPlaying(awayTeam)) {
      throw new Error(`${awayTeam} is already playing a game`);
    }

    this.#scores.push({
      gameId: uuid(),
      kickOff: Date.now(),
      homeTeam,
      awayTeam,
      score: [0, 0],
    });
  }

  /**
   * Remove a finished game from the scoreboard.
   *
   * @param {string} homeTeam
   * @param {string} awayTeam
   */
  finishGame(homeTeam, awayTeam) {
    if (!isString(homeTeam) || !isString(awayTeam)) {
      throw new Error("Expected home and away team names as strings");
    }

    if (!this.#isGameInPlay(homeTeam, awayTeam)) {
      throw new Error("This game is not currently being played");
    }

    const gameIndex = this.#getGameIndex(homeTeam, awayTeam);

    if (gameIndex !== -1) {
      this.#scores.splice(gameIndex, 1);
    }
  }

  /**
   * Update the score of a game.
   *
   * @param {String} homeTeam
   * @param {String} awayTeam
   * @param {Number} homeScore
   * @param {Number} awayScore
   */
  updateScore(homeTeam, awayTeam, homeScore, awayScore) {
    if (!isString(homeTeam) || !isString(awayTeam)) {
      throw new Error("Expected home and away team names as strings");
    }
    if (!isValidScore(homeScore) || !isValidScore(awayScore)) {
      throw new Error("Expected home and away scores to be numbers >= 0");
    }
    if (!this.#isGameInPlay(homeTeam, awayTeam)) {
      throw new Error("Unable to update score, game does not exis");
    }

    const gameIndex = this.#getGameIndex(homeTeam, awayTeam);
    const game = this.#scores[gameIndex];

    this.#scores.splice(gameIndex, 1, {
      ...game,
      score: [homeScore, awayScore],
    });
  }

  /**
   * Returns all scores in order total score.
   * When total scores equal, order by most recently started.
   *
   * @returns {Array<Object>} scores
   */
  liveScores() {
    // The consumer should not have access to
    // the original array as it is mutable.
    const scoresCopy = [...this.#scores];

    return scoresCopy.sort((a, b) => {
      const totalScoresA = a.score[0] + a.score[1];
      const totalScoresB = b.score[0] + b.score[1];

      // If both games have an equal total score,
      // sort by the most recently started game.
      if (totalScoresA === totalScoresB) {
        if (b.kickOff > a.kickOff) return 1;

        return -1;
      }

      // Both games have different total scores, sort by this.
      if (totalScoresB > totalScoresA) return 1;

      return -1;
    });
  }

  /**
   * Returns the scores in textual form.
   *
   * @returns {String} Formatted scoreboard.
   */
  liveBoard() {
    return this.liveScores()
      .map((s) => `${s.homeTeam} ${s.score[0]} - ${s.awayTeam} ${s.score[1]}\n`)
      .join("")
      .trim();
  }
}
