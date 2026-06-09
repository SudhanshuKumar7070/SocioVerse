import { Queue } from "bullmq";
import { redisClient } from "../server/redis.server.js";
const connection = redisClient;


export const notificationDLQ = new Queue("notificatin-dlq",{connection:connection})