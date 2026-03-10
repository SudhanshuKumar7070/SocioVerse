import IORedis from "ioredis";
import { Queue } from "bullmq";

const connection = new IORedis({
    host:"localhost",
    port:6379,
    maxRetriesPerRequest:null
})

 export const videoTrancodingDLQ= new Queue(
    "video_transcoader_dlq",{connection:connection}
);