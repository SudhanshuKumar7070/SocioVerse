import { ApiError } from "../Utils/ApiError.js";

import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { redisClient } from "../server/redis.server.js";
const   RATE_LIMIT_DURATION_IN_SECONDS = 60;
 const NUMBER_OF_REQUESTS_ALLOWED = 10;

const apiRateLimiter = AsyncHandler(async(req,res,next)=>{
   const userId = req.user?._id;
   if(!userId) throw new ApiError( 402,"invalid user!, need to login first");
  const currentTime = Date.now();
    const result = await redisClient.hgetall(`user_id:${userId}`);
     if(Object.keys(result).length === 0){
        await redisClient.hset(`user_id:${userId}`,{
          createdAt: currentTime,
          count:1
        })
        next();
     }
      const timeDiff  = currentTime-Number(result["createdAt"]);
      if ( timeDiff < RATE_LIMIT_DURATION_IN_SECONDS *1000 ){
           if(Number(result["count"]) < NUMBER_OF_REQUESTS_ALLOWED){
            await redisClient.hset(`user_id:${userId}`,{
          count:Number(result["count"])+1
         })
         next();
           }
           else{
             throw new ApiError(429,"rate limit exceeded");
           }
      }else{
         await redisClient.hset(`user_id:${userId}`,{
                    createdAt:currentTime,
                    count:1
      })
      next();
      }
})
export {apiRateLimiter}