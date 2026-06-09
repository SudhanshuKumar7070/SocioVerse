import IORedis from "ioredis";
import { Queue } from "bullmq";

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
});

 export const videoTrancodingDLQ= new Queue(
    "video_transcoader_dlq",{connection:connection}
);