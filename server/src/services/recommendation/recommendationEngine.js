// ============================================
// Graph-based recommendation system
// ============================================

class RecommendationGraph {
  constructor() {
    // Adjacency list: userId -> [placeIds]
    this.userPlaces = new Map();
    // Adjacency list: placeId -> [userIds]
    this.placeUsers = new Map();
    // User interactions: userId -> { placeId: weight }
    this.interactions = new Map();
  }

  /**
   * Add user-place interaction
   * @param {string} userId 
   * @param {string} placeId 
   * @param {string} interactionType - 'booked', 'liked', 'reviewed', 'viewed'
   */
  addInteraction(userId, placeId, interactionType = 'viewed') {
    // Weight different interactions differently
    const weights = {
      booked: 10,
      reviewed: 5,
      liked: 3,
      viewed: 1
    };

    const weight = weights[interactionType] || 1;

    // Update user -> places
    if (!this.userPlaces.has(userId)) {
      this.userPlaces.set(userId, new Map());
    }
    const userPlaceMap = this.userPlaces.get(userId);
    userPlaceMap.set(placeId, (userPlaceMap.get(placeId) || 0) + weight);

    // Update place -> users
    if (!this.placeUsers.has(placeId)) {
      this.placeUsers.set(placeId, new Map());
    }
    const placeUserMap = this.placeUsers.get(placeId);
    placeUserMap.set(userId, (placeUserMap.get(userId) || 0) + weight);
  }

  /**
   * Find similar users using collaborative filtering
   * @param {string} userId 
   * @param {number} limit 
   */
  findSimilarUsers(userId, limit = 10) {
    const userPlaces = this.userPlaces.get(userId);
    if (!userPlaces) return [];

    const similarityScores = new Map();

    // Calculate similarity with other users
    for (const [placeId, weight] of userPlaces) {
      const placeUserMap = this.placeUsers.get(placeId);
      if (!placeUserMap) continue;

      for (const [otherUserId, otherWeight] of placeUserMap) {
        if (otherUserId === userId) continue;

        const score = weight * otherWeight;
        similarityScores.set(
          otherUserId,
          (similarityScores.get(otherUserId) || 0) + score
        );
      }
    }

    // Sort by similarity score
    return Array.from(similarityScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId, score]) => ({ userId, score }));
  }

  /**
   * Recommend places for a user using collaborative filtering
   * @param {string} userId 
   * @param {number} limit 
   */
  recommendPlaces(userId, limit = 10) {
    const userPlaces = this.userPlaces.get(userId);
    const userPlaceSet = new Set(userPlaces ? userPlaces.keys() : []);

    const similarUsers = this.findSimilarUsers(userId, 20);
    const placeScores = new Map();

    // Aggregate recommendations from similar users
    for (const { userId: similarUserId, score: userSimilarity } of similarUsers) {
      const similarUserPlaces = this.userPlaces.get(similarUserId);
      if (!similarUserPlaces) continue;

      for (const [placeId, interactionWeight] of similarUserPlaces) {
        // Skip places user has already interacted with
        if (userPlaceSet.has(placeId)) continue;

        const recommendationScore = userSimilarity * interactionWeight;
        placeScores.set(
          placeId,
          (placeScores.get(placeId) || 0) + recommendationScore
        );
      }
    }

    // Sort by recommendation score
    return Array.from(placeScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([placeId, score]) => ({ placeId, score }));
  }

  /**
   * Find places similar to a given place
   * @param {string} placeId 
   * @param {number} limit 
   */
  findSimilarPlaces(placeId, limit = 10) {
    const placeUserMap = this.placeUsers.get(placeId);
    if (!placeUserMap) return [];

    const similarityScores = new Map();

    // Find places that share users
    for (const [userId, weight] of placeUserMap) {
      const userPlaceMap = this.userPlaces.get(userId);
      if (!userPlaceMap) continue;

      for (const [otherPlaceId, otherWeight] of userPlaceMap) {
        if (otherPlaceId === placeId) continue;

        const score = weight * otherWeight;
        similarityScores.set(
          otherPlaceId,
          (similarityScores.get(otherPlaceId) || 0) + score
        );
      }
    }

    return Array.from(similarityScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([placeId, score]) => ({ placeId, score }));
  }

  /**
   * Build graph from database
   * @param {Array} bookings - Array of booking documents
   * @param {Array} likes - Array of like documents
   * @param {Array} reviews - Array of review documents
   */
  async buildFromDatabase(bookings = [], likes = [], reviews = []) {
    // Add bookings
    for (const booking of bookings) {
      this.addInteraction(
        booking.user.toString(),
        booking.place.toString(),
        'booked'
      );
    }

    // Add likes
    for (const like of likes) {
      this.addInteraction(
        like.userId.toString(),
        like.placeId.toString(),
        'liked'
      );
    }

    // Add reviews
    for (const review of reviews) {
      this.addInteraction(
        review.userId.toString(),
        review.placeId.toString(),
        'reviewed'
      );
    }
  }
}

// Singleton instance
const recommendationGraph = new RecommendationGraph();

export { recommendationGraph, RecommendationGraph };