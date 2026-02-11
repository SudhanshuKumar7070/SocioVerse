import Redis from 'ioredis'
import redis from 'redis'

const redisClient  = Redis.createClient({
   host:"127.0.0.1",
    port:6379
})
redisClient.on("connect",()=>{
  console.log('server connected to redis successfully');
  
})
redisClient.on("error",(err)=>{
  console.log('something went wrong in error connection , error = ', err);
  
})
  // server must be a publisher of notifications
//   const publisher = redis.createClient({
//     socket: {
//       host: 'localhost', 
//       port:6379,
//     },
//   });
  
//   const subscriber = redis.createClient({
//     socket: {
//       host: 'localhost',
//       port: 6379,
//     },
//   });
  
   
//   const initialiseRedis =async()=>{
// try{
// await publisher.connect();
// await subscriber.connect();
// console.log('successfull connection');

// }catch(err){
//   console.log('error at redis', err);
  
// }
 
//   }
//   initialiseRedis();

//   publisher.on("connect",()=>{
//     console.log('publisher is connected to redis');
//   })

//   subscriber.on("connect",()=>{
//     console.log('subscriber is connected to redis');
    
//   })
 
 

//   export { publisher, subscriber}
export {redisClient}