import { createClient } from "@supabase/supabase-js";


// const supabaseApi_key = "https://ozkbzspjxysljtsuyrqq.supabase.co/storage/v1/s3";
const supabaseApi_key = "https://ozkbzspjxysljtsuyrqq.supabase.co";
const supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a2J6c3BqeHlzbGp0c3V5cnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDMwNjMsImV4cCI6MjA2OTIxOTA2M30.AuhqtkWXkiGMlSNG-05y3xw2_mOM_XnfcD0BZcf2NJA"
export const supabase= createClient(
supabaseApi_key,supabase_anon_key
)
if(!supabase) throw new Error("supabase integration failed");
console.log('supabase integtation',supabase);

//  call supabase create function only when needed ,
 export const createBucket = async ()=>{
    try{
const supaBucket = await supabase.storage.createBucket('socioverse-videostreaming',{
    public:true
});
console.log('supaBucket is creating or not:',supaBucket);

if(!supaBucket) throw new Error('bucket creation failed');
return supaBucket;
    }
    catch(err){
        console.log('bucket creation error:',err);
        
    }

 }
// method to upload content to supabase;
 

// const fileData ={
//     name:"Sudhanshu",
//     pupose:"to be best webDev in the the world",
//     description:"this is the first data to be uploaded on supabase"
// }
 
export const uploadContent = async (fileData, fileName) => {
    try {
        if (!fileData) {
            throw new Error('No file data provided');
        }

        const { data, error } = await supabase.storage
            .from('socioverse-videostreaming')
            .upload(fileName, fileData, {
                cacheControl: '3600',
                upsert: false
            });
 if(data) return data;
        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        console.log('Upload successful:', data);
        return data;
        
    } catch (err) {
        console.log('Some error occurred in uploading data to cloud');
        console.log('Cloud error:', err);
        return null;
    }
};
 