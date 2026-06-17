import { createClient, RedisClientType } from "redis";
import { env } from "../../config/env";

class RedisService {
    private client: RedisClientType | null = null;
    private isConnected: boolean = false;
    async connect(): Promise<void> {
        try {
            const redisUrl = env.REDIS_URL;
            this.client = createClient({
                url: redisUrl,
            });
            this.client.on("error", (err:any)=>{
                console.error("Redis Client Error", err);
                this.isConnected = false;
            });

            this.client.on("connect", ()=> {
                console.log("Connected to Redis successfully");
                this.isConnected = true;
            });

            this.client.on("ready",()=> {
                console.log("Redis client is ready to use");
                this.isConnected = true;
            });

            this.client.on("end", ()=> {
                console.log("Redis connection closed");
                this.isConnected = false;
            });
            this.client.on("reconnecting",()=>{
                console.log("Attempting to reconnect to Redis...");
            });
            await this.client.connect();
        } catch (error) {
            console.error("Failed to connect to Redis", error);
            this.isConnected = false;
        }

    }

    private ensureConnected(): RedisClientType {
        if (!this.client || !this.isConnected) {
            throw new Error("Redis client is not connected");
        }

        
        return this.client;
    }
    async get(key: string): Promise<string | null> {
        try {
            const client = this.ensureConnected();
            return await client.get(key);
        } catch (error) {
            console.error(`Error getting key ${key} from Redis`, error);
            return null; 
        }
    }

    async set(key: string, value: string, ttlInSeconds: number):  Promise<void> {
        try {
            const client = this.ensureConnected();
            const stringValue = typeof value === "string" ? value : JSON.stringify(value);
            await client.set(key, stringValue, {
                EX: ttlInSeconds,
            });

        } catch (error) {
            console.error(`Error setting key ${key} in Redis`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            const client = this.ensureConnected();
            await client.del(key);
        } catch (error) {
            console.error(`Error deleting key ${key} from Redis`, error);
        }
    }

    async update(key: string, value: string, ttlInSeconds: number): Promise<void> {
        try {
            const client = this.ensureConnected();
            const stringValue = typeof value === "string" ? value : JSON.stringify(value);
            await client.set(key, stringValue, {
                EX: ttlInSeconds,
            });
        } catch (error) {
            console.error(`Error updating key ${key} in Redis`, error);
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            const client = this.ensureConnected();
            await client.ping();
            return true;
            
        } catch (error) {
            console.error("Error checking Redis availability", error);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (this.client && this.isConnected) {
                await this.client.quit();
                this.isConnected = false;
                console.log("Disconnected from Redis successfully");
            }
        } catch (error) {
            console.error("Error disconnecting from Redis", error);
        }
    }
}


export const redisService = new RedisService();
