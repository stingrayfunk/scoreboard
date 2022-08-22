import { Scoreboard } from '.';

describe('Score board library', () => {
  const game = {
    gameId: expect.any(String), // UUID
    kickOff: expect.any(Number), // Milliseconds
    homeTeam: 'Germany',
    awayTeam: 'France',
    score: [0, 0],
  };
  const errorText = 'Expected home and away team names as strings';

  describe('#startGame', () => {
    describe('when a game is started with invalid arguments', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        expect(() => scoreboard.startGame()).toThrowError(errorText);
        expect(() => scoreboard.startGame('Germany')).toThrowError(errorText);
        expect(() => scoreboard.startGame('Germany', 560)).toThrowError(
          errorText
        );
      });

      it('should not start the game', () => {
        const scoreboard = new Scoreboard();

        expect(scoreboard.liveScores()).toEqual([]);

        expect(() => scoreboard.startGame()).toThrowError();

        expect(scoreboard.liveScores()).toEqual([]);
      });
    });

    describe('when starting a game with non existent teams', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        expect(() => scoreboard.startGame('Jupiter', 'Saturn')).toThrowError(
          'At least one team provided does not exist'
        );
      });

      it('should not start the game', () => {
        const scoreboard = new Scoreboard();

        expect(scoreboard.liveScores()).toEqual([]);

        expect(() => scoreboard.startGame('Jupiter', 'Saturn')).toThrowError();

        expect(scoreboard.liveScores()).toEqual([]);
      });
    });

    describe('when a game had already been started before', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');

        expect(() => scoreboard.startGame('Germany', 'France')).toThrowError(
          'This game is already in play'
        );
      });
    });

    describe('when one of the teams is already playing a game', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');

        expect(() => scoreboard.startGame('Argentina', 'France')).toThrowError(
          'France is already playing a game'
        );
      });
    });

    describe('when a game is started correctly', () => {
      it('should appear on the board with initial 0 0 scores', () => {
        const scoreboard = new Scoreboard();

        expect(scoreboard.liveScores()).not.toContain(game);

        scoreboard.startGame('Germany', 'France');

        expect(scoreboard.liveScores()).toContainEqual(game);
      });
    });
  });

  describe('#finishGame', () => {
    describe('when a game is finished incorrectly', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        expect(() => scoreboard.finishGame()).toThrowError(errorText);
        expect(() => scoreboard.finishGame('Germany')).toThrowError(errorText);
        expect(() => scoreboard.finishGame('Germany', 560)).toThrowError(
          errorText
        );
      });

      it('should not finish the game', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');

        expect(scoreboard.liveScores()).toContainEqual(game);

        expect(() => scoreboard.finishGame()).toThrowError();

        expect(scoreboard.liveScores()).toContainEqual(game);
      });
    });

    // We don't need to cover attempting to finish a game of
    // non-existent teams, it's covered as part of this scenario.
    describe('when attempting to finish a non existent game', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        expect(() =>
          scoreboard.finishGame('Australia', 'Denmark')
        ).toThrowError('This game is not currently being played');

        scoreboard.startGame('Germany', 'France');
        scoreboard.startGame('Spain', 'Brazil');

        expect(() => scoreboard.finishGame('Spain', 'Denmark')).toThrowError(
          'This game is not currently being played'
        );
      });
    });

    describe('when a game is finished correctly', () => {
      it('should no longer appear on the score board', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');
        scoreboard.startGame('Spain', 'Brazil');
        scoreboard.startGame('Uruguay', 'Mexico');

        expect(scoreboard.liveScores()).toHaveLength(3);

        const scores = scoreboard.liveScores();

        expect(scores[2]).toEqual(
          expect.objectContaining({
            homeTeam: 'Germany',
            awayTeam: 'France',
          })
        );

        scoreboard.finishGame('Germany', 'France');

        expect(scoreboard.liveScores()).toHaveLength(2);

        const homeTeams = scoreboard.liveScores().map((g) => g.homeTeam);
        const awayTeams = scoreboard.liveScores().map((g) => g.awayTeam);
        expect(homeTeams).not.toContain('Germany');
        expect(awayTeams).not.toContain('France');
      });
    });
  });

  describe('#updateScore', () => {
    describe('when the score is updated with invalid arguments', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');

        const scores = scoreboard.liveScores();

        expect(scores).toContainEqual(game);

        expect(() => scoreboard.updateScore()).toThrowError(
          'Expected home and away team names as strings'
        );
        expect(() =>
          scoreboard.updateScore('Germany', 'France', 23)
        ).toThrowError('Expected home and away scores to be numbers >= 0');
        expect(() =>
          scoreboard.updateScore('Germany', 'France', -1, -5)
        ).toThrowError('Expected home and away scores to be numbers >= 0');
      });

      it('should not update the score', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');

        const scores = scoreboard.liveScores();

        expect(scores).toContainEqual(game);

        const [germanyFrance] = scores;

        expect(() => scoreboard.updateScore()).toThrowError();

        const scores2 = scoreboard.liveScores();
        const [germanyFrance2] = scores2;

        expect(germanyFrance).toEqual(germanyFrance2);
      });
    });

    describe('when no game exists for the specified teams', () => {
      it('should throw an error', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');

        const scores = scoreboard.liveScores();

        expect(scores).toContainEqual(game);

        expect(() =>
          scoreboard.updateScore('Spain', 'Brazil', 2, 3)
        ).toThrowError('Unable to update score, game does not exis');
      });
    });

    describe('when the score is updated correctly', () => {
      it('should be reflected in the live score', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');

        const scores = scoreboard.liveScores();

        expect(scores).toContainEqual(game);

        scoreboard.updateScore('Germany', 'France', 2, 4);

        expect(scoreboard.liveScores()).toContainEqual({
          ...game,
          score: [2, 4],
        });
      });
    });
  });

  describe('#liveScores', () => {
    describe('when there are no live games', () => {
      it('should return an empty array', () => {
        const scoreboard = new Scoreboard();

        expect(scoreboard.liveScores()).toEqual([]);
      });
    });

    describe('when there are live games', () => {
      it('should return an array of games', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Germany', 'France');
        scoreboard.startGame('Argentina', 'Brazil');

        expect(scoreboard.liveScores()).toEqual([
          {
            gameId: expect.any(String),
            kickOff: expect.any(Number),
            homeTeam: 'Argentina',
            awayTeam: 'Brazil',
            score: [0, 0],
          },
          {
            gameId: expect.any(String),
            kickOff: expect.any(Number),
            homeTeam: 'Germany',
            awayTeam: 'France',
            score: [0, 0],
          },
        ]);
      });

      it('should return games in the correct order', () => {
        const scoreboard = new Scoreboard();

        scoreboard.startGame('Mexico', 'Canada');
        scoreboard.startGame('Spain', 'Brazil');
        scoreboard.startGame('Germany', 'France');
        scoreboard.startGame('Uruguay', 'Italy');
        scoreboard.startGame('Argentina', 'Australia');

        scoreboard.updateScore('Mexico', 'Canada', 0, 5);
        scoreboard.updateScore('Spain', 'Brazil', 10, 2);
        scoreboard.updateScore('Germany', 'France', 2, 2);
        scoreboard.updateScore('Uruguay', 'Italy', 6, 6);
        scoreboard.updateScore('Argentina', 'Australia', 3, 1);

        // Ordered by total score and for games with the same total score,
        // those are ordered by most recent kickoff time.
        // There should not be two games with the same kickoff time because
        // the timestamp will be different for each call to startGame().
        expect(scoreboard.liveScores()).toEqual([
          {
            gameId: expect.any(String),
            kickOff: expect.any(Number),
            homeTeam: 'Uruguay',
            awayTeam: 'Italy',
            score: [6, 6],
          },
          {
            gameId: expect.any(String),
            kickOff: expect.any(Number),
            homeTeam: 'Spain',
            awayTeam: 'Brazil',
            score: [10, 2],
          },
          {
            gameId: expect.any(String),
            kickOff: expect.any(Number),
            homeTeam: 'Mexico',
            awayTeam: 'Canada',
            score: [0, 5],
          },
          {
            gameId: expect.any(String),
            kickOff: expect.any(Number),
            homeTeam: 'Argentina',
            awayTeam: 'Australia',
            score: [3, 1],
          },
          {
            gameId: expect.any(String),
            kickOff: expect.any(Number),
            homeTeam: 'Germany',
            awayTeam: 'France',
            score: [2, 2],
          },
        ]);
      });
    });
  });

  describe('#liveBoard', () => {
    it('should return the score board as a string', () => {
      const scoreboard = new Scoreboard();

      scoreboard.startGame('Germany', 'France');
      scoreboard.startGame('Argentina', 'Brazil');

      expect(scoreboard.liveBoard()).toEqual(
        `Argentina 0 - Brazil 0
Germany 0 - France 0`
      );
    });
  });

  it('should not be able to access scores field', () => {
    const scoreboard = new Scoreboard();

    scoreboard.startGame('France', 'Germany');

    expect(scoreboard.scores).toBeUndefined();
  });
});
