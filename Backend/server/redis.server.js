import redis from 'redis'

  // server must be a publisher of notifications
  const publisher = redis.createClient({
    socket: {
      host: '127.0.0.1', // or your Redis host
      port: 3000,        // or your Redis port
    },
  });
  
  const subscriber = redis.createClient({
    socket: {
      host: '127.0.0.1',
      port: 3000,
    },
  });
  
   
  const initialiseRedis =async()=>{
try{
await publisher.connect();
await subscriber.connect();
console.log('successfull connection');

}catch(err){
  console.log('error at redis', err);
  
}
 
  }
  initialiseRedis();

  publisher.on("connect",()=>{
    console.log('publisher is connected to redis');
  })

  subscriber.on("connect",()=>{
    console.log('subscriber is connected to redis');
    
  })
 
 

  export { publisher, subscriber}