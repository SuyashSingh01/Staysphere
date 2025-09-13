import { createClient } from "redis";
import dotenv from "dotenv";
import { ENV } from "../constant/env.js";

dotenv.config();

class RedisConnection {
    constructor() {
        this.client = null;
    }

    async connect() {
        try {

            const url = ENV.REDIS_SERVICE.REDIS_URL || `redis://default:${ENV.REDIS_SERVICE.REDIS_PASSWORD}@${ENV.REDIS_SERVICE.REDIS_HOST}:${ENV.REDIS_SERVICE.REDIS_PORT}`;
            // change host in env if using local redis without docker
            if (url) {
                this.client = createClient({ url });
            } else {
                this.client = createClient({
                    username: ENV.REDIS_SERVICE.REDIS_USERNAME || 'default',
                    password: ENV.REDIS_SERVICE.REDIS_PASSWORD || undefined,
                    socket: {
                        host: ENV.REDIS_SERVICE.REDIS_HOST || 'localhost',
                        port: ENV.REDIS_SERVICE.REDIS_PORT || 6379,
                    }
                });
            }

            this.client.on("error", (error) => {
                console.error(" Redis connection error:", error);
            });

            this.client.on("connect", () => {
                console.info(" Redis connected successfully");
            });

            this.client.on("ready", () => {
                console.info(" Redis ready to accept commands");
            });

            this.client.on("end", () => {
                console.warn(" Redis connection ended");
            });

            await this.client.connect();
            return this.client;
        } catch (error) {
            console.error(" Failed to connect to Redis:", error);
            throw error;
        }
    }

    getClient() {
        if (!this.client) {
            throw new Error("Redis client not initialized. Call connect() first.");
        }
        return this.client;
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            console.info("🔌 Redis disconnected");
        }
    }
}

export const redisConnect = new RedisConnection();
