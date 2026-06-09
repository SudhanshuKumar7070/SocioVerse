import {Queue, Worker} from "bullmq";
import { redisClient } from "../server/redis.server.js";
 export const connection = redisClient;


export const   pushNotificationQueue = new Queue("pushNotificationQueue",{
    connection:connection,
    defaultJobOptions:{
        attempts:5,
        backoff:{
            type:"exponential",
            delay:2000
        },
        removeOnComplete:true,
        removeOnFail:true
    }
});
export const  inAppNotificationQueue = new Queue("inAppNotificationQueue",{
    connection:connection,
    defaultJobOptions:{
        attempts:5,
        backoff:{
            type:"exponential",
            delay:2000
        },
        removeOnComplete:true,
        removeOnFail:true
    }
});
export const   emailQueue = new Queue("sendEmailQueue", {
    connection:connection,
    defaultJobOptions:{
        attempts:5,
        backoff:{
            type:"exponential",
            delay:2000
        },
        removeOnComplete:true,
        removeOnFail:true
    }
});

// export const emailWorker = new Worker("emailQueue", async (job) => {
//     const {to, subject, text} = job.data;
//     console.log(`Sending email to ${to} with subject ${subject}`);
// }, connection);