import{ v2 as cloudinary} from "cloudinary"
 
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME || "dduov7hpl",
    api_key: process.env.API_KEY || 794895145383572,
    api_secret:process.env.API_SECRET || "twYLZxtmP_HIOB-1Byw8zzoD40E"
});

 export const uploadVideo = async(localVideoPath)=>{
    try{
        if (!localVideoPath)  return null;
       const response = await cloudinary.uploader.upload(localVideoPath,{
                resource_type:"auto"
       })
          console.log('response of uploaded file',response);
          console.log('response url',response.url);
          
          
       return response
          
    }
    catch (error) {
        console.error("Cloudinary upload error:", error.message);
        throw new Error(error.message); // Re-throws the error
      }
  
      
}