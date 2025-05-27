import mongoose from "mongoose";
import { Tweet } from "../Models/tweet.model.js";
// import { User } from "../Models/user.model";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { uploadProfileImage } from "../Utils/uploadToCloudinary.js";
import { User } from "../Models/user.model.js";

// cretate a tweet
 
const createTweet = AsyncHandler(async(req, res) =>{
       const {TextContent}= req.body;
       console.log('trycontent::',TextContent);
       
       
       if(!TextContent) throw new ApiError(400,"can't create empty tweet required")
        const userId = req.user._id;
          if(!userId) throw new ApiError(400,"unauthorised access");

          let contentImageCloudUrl ;
        const tweetImageLocalPath = req.files["contentImage"]? req.files['contentImage'][0]:null;
        if(tweetImageLocalPath){
          const contentImageCloudPath = await uploadProfileImage(tweetImageLocalPath);
           if(! contentImageCloudPath ) throw new ApiError(500,"error in uploading content image to cloudinary");
           contentImageCloudUrl = contentImageCloudPath?.url;
        }
        let tweetVideoUrl;
         const tweetVideoLocalPath = req.files["contentVideo"]?req.files["contentVideo"][0]:null;
           if(tweetVideoLocalPath){
            const videoCloudPath = await uploadProfileImage(tweetVideoLocalPath);
            if(!videoCloudPath) throw new ApiError(500,"something went wrong in uploading video to cloudinary");
            tweetVideoUrl=videoCloudPath?.url
           }
        
          const tweet =  new Tweet({
            userId:userId, 
            TextContent:TextContent,
            imageUrl: contentImageCloudUrl?contentImageCloudUrl: null,
            videoContent: tweetVideoUrl?tweetVideoUrl:null
          })
          await tweet.save();
           if(!tweet) throw new ApiError(400,"unable to create tweet")

            return res.status(200).json( new ApiResponse(200,tweet,"tweet created successfully"));

})
//  delete tweets
const deleteTweet = AsyncHandler(async(req,res)=>{
      const {tweetId} = req.params;
      if(!tweetId) throw new ApiError(400,"tweet id is required")
      // only owner of tweet should be able to delete the tweet
       const userId = req.user._id;
       if(!userId) throw new ApiError(400,"unauthorised access");
         if(!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(400,"invalid tweet id")
         // check if tweet is present or not
         const tweet = await Tweet.findById(tweetId).select("userId")
         if(!tweet) throw new ApiError(400,"tweet not found")
         // check if user is owner of the tweet or not
             if(tweet.userId.toString() !== userId.toString()) throw new ApiError(400,"you are not owner of the tweet")
     
         const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
          if (!deletedTweet) throw new ApiError(400,"unable to delete tweet at the moment");    

          return res.status(200).json(new ApiResponse(200,deletedTweet,"tweet deleted successfully"));
})
 // edit tweet text content
const editTweet = AsyncHandler(async(req,res)=>{
     const {tweetId} = req.params;

     if (!tweetId) throw new ApiError(400,"tweet id is required")
    if(!mongoose.Types.ObjectId.isValid(tweetId)) throw new ApiError(400,"invalid tweet id")
  const content = req.body.content;
    if(!content) throw new ApiError(400,"content is required")
    // only owner of the tweet should be able to edit the tweet
 const userId = req.user?._id;
    if(!userId) throw new ApiError(400,"unauthorised action");
//  check if tweet is avaialble or not
const tweet = await Tweet.findById(tweetId).select("userId")
if(!tweet) throw new ApiError(400,"tweet not found")
    // check if user is qwner of tweet or not
 if (tweet.userId.toString() !== userId.toString()) throw new ApiError(400,"you are not owner of the tweet , prohibited action")
    // uodate tweet
const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{content:content},{new:true})
 if(!updatedTweet) throw new ApiError(400,"unable to update tweet at the moment")
    return res.status(200).json(new ApiResponse(200,updatedTweet,"tweet updated successfully"))
})
// edit image of tweet ;
 const editTweetUrl = AsyncHandler(async(req,res)=>{
   const userId = req.user?._id;
    if(!userId) throw new ApiError(400,"unauthorised access ");
    const {tweetId} = req.params;
    if(!tweetId.trim()) throw new ApiError(404,"tweet id is not avaialable");
    if(!mongoose.Types.ObjectId.isValid(tweetId)) throw new  ApiError(500,"invalid tweetId");
    const newImageLocalPath = req.file?.path
    if(!newImageLocalPath) throw new ApiError(400 ," image is not available locally");
    const cloudinaryPath = await uploadProfileImage(newImageLocalPath);
    if(!cloudinaryPath.url) throw new ApiError(500,"something went wrong in uplaoding image to cloudinary");
     const updatedImage = await Tweet.findByIdAndUpdate(new mongoose.Types.ObjectId(tweetId),
    {
      $set:{
        imageUrl:cloudinaryPath.url
      }
    })
    if(!updatedImage) throw new ApiError(500,"something went wrong  in updating image of tweet");
    return res.status(200).json(new ApiResponse(200,updatedImage,"data updated successfully"))
 })

// get all tweets of logged in user
const listAllTweetsOfUser = AsyncHandler(async(req,res)=>{
     const userId = req.user._id;
     if(!userId) throw new ApiError(400 , " unathorised action")
 const tweets= await Tweet.aggregate([{
$match:{
    userId:userId
},
$sort:{
    createdAt:-1
}
}])
 if(!tweets || tweets.length ===0) throw new ApiError(400,"no tweets available");

 return res.status(200).json(new ApiResponse(200, tweets,"tweets fetched successfully"))
})

  // TODO: create a endpoint to all tweets of all users -> any one can read and write tweets


  // get all tweets , available in database
    const getAllTweets = AsyncHandler(async(req,res)=>{
        const  loginId = req.user._id;
        if(!loginId) throw new ApiError(400,"unauthorised access")

          const {
            page = 1,
            limit = 10,
        
            sortType = "asc",
            sortBy = "createdAt",
          } = req.query;
          //  if ( !userId.trim()) throw new ApiError(400,"user id not found") ;
          const pageNo = parseInt(page) > 0 ? parseInt(page) : 1;
          const limitNo = parseInt(limit) > 0 ? parseInt(limit) : 10;
          const skip = (pageNo - 1) * limitNo;
          const tweet = await Tweet.aggregate([{
            $lookup:{
              from:"users",
               localField:"userId",
               foreignField:"_id",
               as:"UserData"
            }
          },{
            $project:{
              TextContent:1,
              imageUrl:1,
              videoContent:1,
              UserData:1
            }
          },{
            $sort:{
              createdAt:1
            }
          }]).skip(skip);
           
            
          if (!tweet) throw new ApiError(500, "error in fetching tweets !");
          return res.status(200).json(new ApiResponse(200,tweet,"tweet fetched sucsessfully"));
    })

    //  get all tweets of particular user or any user;
     const getIndividualsTweets= AsyncHandler(async(req,res)=>{
       const isLogin = req.user?._id
       if(!isLogin) throw new ApiError(400,"auauthorised access");
       const {userId} = req.params;
       if(!userId.trim()) throw new ApiError(404,"user id missing!");
       if (!mongoose.Types.ObjectId.isValid(userId)) throw new ApiError(500,"invalid userId");
      
         const tweets = await User.aggregate([{
          $match:{
            _id: new mongoose.Types.ObjectId(userId)
          }
         },
        {
          $lookup:{
            from:"tweets",
            localField:"_id",
            foreignField:"userId",
            as:"UserTweets"

          }
        },
        {
          $project:{
            UserTweets:1
          }
        },
        {
          $sort:{
            createdAt:-1
          }
        }
      ])
      if(!tweets  || tweets.length === 0) throw new ApiError(404," something went wrong in finding tweets")
        return res.status(200).json( new ApiResponse(200,tweets,"tweets fetched successfully"));
     })
  


export {createTweet,deleteTweet,editTweet,listAllTweetsOfUser,getAllTweets,getIndividualsTweets}