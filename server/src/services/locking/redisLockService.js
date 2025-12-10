
import { redisConnect } from '../../config/redis.js';

class RedisLockService {
  /**
   * Acquire a distributed lock with retry mechanism
   * @param {string} lockKey - The key for the lock
   * @param {string} lockValue - Unique value (usually userId or requestId)
   * @param {number} ttl - Time to live in seconds
   * @param {number} maxRetries - Maximum number of retry attempts
   * @param {number} retryDelay - Delay between retries in ms
   */
  static async acquireLock(lockKey, lockValue, ttl = 300, maxRetries = 10, retryDelay = 100) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Use SET with NX (only set if not exists) and EX (expiry)
        const result = await redisConnect.set(lockKey, lockValue, {
          NX: true,
          EX: ttl
        });

        if (result === 'OK') {
          return { success: true, attempt };
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } catch (error) {
        console.error(`Lock acquisition attempt ${attempt + 1} failed:`, error);
      }
    }

    return { success: false, attempt: maxRetries };
  }

  /**
   * Release a lock only if the value matches
   * @param {string} lockKey - The key for the lock
   * @param {string} lockValue - The value that was set
   */
  static async releaseLock(lockKey, lockValue) {
    try {
      // Lua script to ensure atomic check-and-delete
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;

      const result = await redisConnect.eval(luaScript, 1, lockKey, lockValue);
      return result === 1;
    } catch (error) {
      console.error('Error releasing lock:', error);
      return false;
    }
  }

  /**
   * Extend lock expiry if still held by the same owner
   * @param {string} lockKey - The key for the lock
   * @param {string} lockValue - The value that was set
   * @param {number} additionalTtl - Additional seconds to add
   */
  static async extendLock(lockKey, lockValue, additionalTtl = 300) {
    try {
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("expire", KEYS[1], ARGV[2])
        else
          return 0
        end
      `;

      const result = await redisConnect.eval(luaScript, 1, lockKey, lockValue, additionalTtl);
      return result === 1;
    } catch (error) {
      console.error('Error extending lock:', error);
      return false;
    }
  }

  /**
   * Check if a lock exists
   * @param {string} lockKey - The key for the lock
   */
  static async isLocked(lockKey) {
    try {
      const value = await redisConnect.get(lockKey);
      return value !== null;
    } catch (error) {
      console.error('Error checking lock:', error);
      return false;
    }
  }

  /**
   * Get lock owner
   * @param {string} lockKey - The key for the lock
   */
  static async getLockOwner(lockKey) {
    try {
      return await redisConnect.get(lockKey);
    } catch (error) {
      console.error('Error getting lock owner:', error);
      return null;
    }
  }
}

const redisLockService = new RedisLockService();
export default redisLockService;
