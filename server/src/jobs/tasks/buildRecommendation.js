// ============================================
// Background job to rebuild recommendation graph
// ============================================

import cron from 'node-cron';
const { recommendationGraph } = require('../../services/recommendation/recommendationEngine');
import Booking from '../../models/Booking.model.js';
import Like from '../../models/Like.model.js';
import Review from '../../models/Review.model.js';

async function buildRecommendationGraph() {
  console.log('Building recommendation graph...');
  const startTime = Date.now();

  try {
    // Fetch all interactions from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [bookings, likes, reviews] = await Promise.all([
      Booking.find({ createdAt: { $gte: sixMonthsAgo } }).select('user place createdAt'),
      Like.find({ createdAt: { $gte: sixMonthsAgo } }).select('userId placeId createdAt'),
      Review.find({ createdAt: { $gte: sixMonthsAgo } }).select('userId placeId createdAt')
    ]);

    // Clear and rebuild graph
    await recommendationGraph.buildFromDatabase(bookings, likes, reviews);

    const duration = Date.now() - startTime;
    console.log(`Recommendation graph built successfully in ${duration}ms`);
    console.log(`Users: ${recommendationGraph.userPlaces.size}`);
    console.log(`Places: ${recommendationGraph.placeUsers.size}`);
  } catch (error) {
    console.error('Error building recommendation graph:', error);
  }
}

// Run daily at 2 AM
cron.schedule('0 2 * * *', buildRecommendationGraph);

// Export for manual trigger
export default buildRecommendationGraph;