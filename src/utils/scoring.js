// Scoring utility functions for the Survivor Fantasy League

export const SCORING_RULES = {
  SURVIVOR_POINTS: {
    REWARD_WIN: 1,
    IMMUNITY_WIN: 2,
    ISLAND_CHALLENGE: 1,
    TREE_MAIL: 1,
    MAKE_FIRE: 1,
    FIND_CLUE: 1,
    MERGE: 1,
    FIND_IDOL: 1,
    PLAY_IDOL: 1,
    GAIN_ADVANTAGE: 1
  },
  VOTE_POINTS: {
    MIN: 0,
    MAX: 10
  },
  BONUS_POINTS: {
    WINNER_PICK_MAX: 13,
    ELIMINATION_STREAK_PER_EPISODE: 1
  }
};

/**
 * Calculate survivor points for a user based on their ranked contestants
 * @param {Object} draftRankings - Object mapping contestant IDs to their ranks
 * @param {Array} scoringEvents - Array of scoring events from episodes
 * @param {number} upToEpisode - Calculate points up to this episode (inclusive)
 * @returns {number} Total survivor points
 */
export const calculateSurvivorPoints = (draftRankings, scoringEvents, upToEpisode = null) => {
  if (!draftRankings || !scoringEvents) return 0;

  let totalPoints = 0;
  const rankedContestantIds = Object.keys(draftRankings);

  scoringEvents.forEach(event => {
    // Skip events from future episodes if upToEpisode is specified
    if (upToEpisode && event.episode > upToEpisode) return;

    // Check if any of the user's ranked contestants are involved in this event
    const userContestantsInEvent = event.contestantIds.filter(id => 
      rankedContestantIds.includes(id.toString())
    );

    if (userContestantsInEvent.length > 0) {
      totalPoints += userContestantsInEvent.length * event.points;
    }
  });

  return totalPoints;
};

/**
 * Calculate vote points for a user based on their predictions and actual eliminations
 * @param {Object} votePredictions - User's vote predictions by episode
 * @param {Array} eliminations - Array of elimination events
 * @param {number} upToEpisode - Calculate points up to this episode (inclusive)
 * @returns {number} Total vote points
 */
export const calculateVotePoints = (votePredictions, eliminations, upToEpisode = null) => {
  if (!votePredictions || !eliminations) return 0;

  let totalPoints = 0;

  eliminations.forEach(elimination => {
    // Skip eliminations from future episodes if upToEpisode is specified
    if (upToEpisode && elimination.episode > upToEpisode) return;

    const episode = elimination.episode;
    const eliminatedContestantId = elimination.contestantId;
    const userPredictions = votePredictions[episode];

    if (userPredictions && userPredictions[eliminatedContestantId]) {
      totalPoints += userPredictions[eliminatedContestantId];
    }
  });

  return totalPoints;
};

/**
 * Calculate bonus points for winner prediction
 * @param {Object} winnerPrediction - User's winner prediction object
 * @param {number} actualWinnerId - ID of actual season winner (null if season not complete)
 * @param {number} finalEpisode - Final episode number
 * @param {number} currentEpisode - Current episode for partial calculation
 * @returns {number} Bonus points for winner prediction
 */
export const calculateWinnerBonusPoints = (winnerPrediction, actualWinnerId, finalEpisode, currentEpisode) => {
  if (!winnerPrediction || !winnerPrediction.contestantId) return 0;

  // If season is complete and user picked correctly
  if (actualWinnerId && winnerPrediction.contestantId === actualWinnerId) {
    // Find the longest consecutive streak ending with the final episode
    const episodes = winnerPrediction.episodes.sort((a, b) => a - b);
    let streak = 0;
    let currentStreak = 0;

    // Check for consecutive episodes ending with the final episode
    for (let i = finalEpisode; i >= 1; i--) {
      if (episodes.includes(i)) {
        currentStreak++;
      } else {
        break;
      }
    }

    return Math.min(currentStreak, SCORING_RULES.BONUS_POINTS.WINNER_PICK_MAX);
  }

  return 0;
};

/**
 * Calculate elimination streak bonus points
 * @param {Object} draftRankings - Object mapping contestant IDs to their ranks
 * @param {Array} eliminations - Array of elimination events
 * @param {number} upToEpisode - Calculate points up to this episode (inclusive)
 * @returns {number} Elimination streak bonus points
 */
export const calculateEliminationStreakPoints = (draftRankings, eliminations, upToEpisode = null) => {
  if (!draftRankings || !eliminations) return 0;

  let totalPoints = 0;
  const rankedContestantIds = Object.keys(draftRankings);

  eliminations.forEach(elimination => {
    // Skip eliminations from future episodes if upToEpisode is specified
    if (upToEpisode && elimination.episode > upToEpisode) return;

    const eliminatedContestantId = elimination.contestantId;
    
    if (rankedContestantIds.includes(eliminatedContestantId.toString())) {
      // Award 1 point per episode this contestant is out of the game
      const episodesOutOfGame = upToEpisode ? (upToEpisode - elimination.episode) : 0;
      totalPoints += episodesOutOfGame * SCORING_RULES.BONUS_POINTS.ELIMINATION_STREAK_PER_EPISODE;
    }
  });

  return totalPoints;
};

/**
 * Calculate total score for a user
 * @param {Object} user - User object with picks and predictions
 * @param {Array} scoringEvents - Array of scoring events
 * @param {Array} eliminations - Array of elimination events
 * @param {number} actualWinnerId - Actual winner ID (if season complete)
 * @param {number} currentEpisode - Current episode number
 * @param {number} finalEpisode - Final episode number
 * @returns {Object} Score breakdown
 */
export const calculateTotalScore = (user, scoringEvents, eliminations, actualWinnerId = null, currentEpisode = 1, finalEpisode = 13) => {
  const survivorPoints = calculateSurvivorPoints(user.draftRankings, scoringEvents, currentEpisode);
  const votePoints = calculateVotePoints(user.votePredictions, eliminations, currentEpisode);
  const winnerBonusPoints = calculateWinnerBonusPoints(user.winnerPrediction, actualWinnerId, finalEpisode, currentEpisode);
  const eliminationStreakPoints = calculateEliminationStreakPoints(user.draftRankings, eliminations, currentEpisode);

  const bonusPoints = winnerBonusPoints + eliminationStreakPoints;
  const total = survivorPoints + votePoints + bonusPoints;

  return {
    survivorPoints,
    votePoints,
    bonusPoints,
    total,
    breakdown: {
      winnerBonusPoints,
      eliminationStreakPoints
    }
  };
};

/**
 * Update user scores with calculated values
 * @param {Object} user - User object to update
 * @param {Object} scoreData - Score breakdown from calculateTotalScore
 * @returns {Object} Updated user object
 */
export const updateUserScores = (user, scoreData) => {
  return {
    ...user,
    scores: {
      survivorPoints: scoreData.survivorPoints,
      votePoints: scoreData.votePoints,
      bonusPoints: scoreData.bonusPoints,
      total: scoreData.total
    }
  };
};

/**
 * Apply tie-breaking rules
 * @param {Array} users - Array of users with same total score
 * @returns {Array} Users sorted by tie-breaking rules
 */
export const applyTieBreaking = (users) => {
  return users.sort((a, b) => {
    const aScores = a.scores || { votePoints: 0, survivorPoints: 0, bonusPoints: 0 };
    const bScores = b.scores || { votePoints: 0, survivorPoints: 0, bonusPoints: 0 };

    // First tie-breaker: Vote points
    if (aScores.votePoints !== bScores.votePoints) {
      return bScores.votePoints - aScores.votePoints;
    }

    // Second tie-breaker: Survivor points
    if (aScores.survivorPoints !== bScores.survivorPoints) {
      return bScores.survivorPoints - aScores.survivorPoints;
    }

    // Third tie-breaker: Bonus points
    if (aScores.bonusPoints !== bScores.bonusPoints) {
      return bScores.bonusPoints - aScores.bonusPoints;
    }

    // If still tied, maintain tie
    return 0;
  });
};