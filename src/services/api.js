class ApiService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-app.vercel.app/api'
      : 'http://localhost:3000/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Contestants API
  async getContestants() {
    return this.request('/contestants');
  }

  async updateContestant(id, updates) {
    return this.request('/contestants', {
      method: 'PUT',
      body: { id, updates }
    });
  }

  // Draft API
  async getDraftRankings(userId, seasonId = 1) {
    return this.request(`/draft/rankings?userId=${userId}&seasonId=${seasonId}`);
  }

  async updateDraftRankings(userId, seasonId = 1, rankings) {
    return this.request(`/draft/rankings?userId=${userId}&seasonId=${seasonId}`, {
      method: 'PUT',
      body: { rankings }
    });
  }

  async getDraftPicks(userId, seasonId = 1) {
    return this.request(`/draft/picks?userId=${userId}&seasonId=${seasonId}`);
  }

  async createDraftPicks(userId, seasonId = 1, picks) {
    return this.request(`/draft/picks?userId=${userId}&seasonId=${seasonId}`, {
      method: 'POST',
      body: { picks }
    });
  }

  // Sole Survivor API
  async getSoleSurvivorPick(userId, seasonId = 1) {
    return this.request(`/sole-survivor?userId=${userId}&seasonId=${seasonId}`);
  }

  async selectSoleSurvivor(userId, seasonId = 1, contestantId, isOriginalPick = false) {
    return this.request(`/sole-survivor?userId=${userId}&seasonId=${seasonId}`, {
      method: 'POST',
      body: { contestantId, isOriginalPick }
    });
  }

  async updateSoleSurvivorEpisodes(userId, seasonId = 1, episodes) {
    return this.request(`/sole-survivor?userId=${userId}&seasonId=${seasonId}`, {
      method: 'PUT',
      body: { episodes_held: episodes }
    });
  }

  // Leaderboard API
  async getLeaderboard(seasonId = 1) {
    return this.request(`/leaderboard?seasonId=${seasonId}`);
  }

  async recalculateScores(seasonId = 1) {
    return this.request('/leaderboard', {
      method: 'POST',
      body: { seasonId }
    });
  }
}

export default new ApiService();
