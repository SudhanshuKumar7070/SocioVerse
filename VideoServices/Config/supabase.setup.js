import { createClient } from "@supabase/supabase-js";


// ✅ CORRECT project URL — format: https://<ref>.supabase.co
const supabase_endpoint = "https://smdwsiubqlgtipviftpw.supabase.co";

// ⚠️  Use service_role key for server-side uploads — it bypasses RLS
// Get it from: Supabase Dashboard → Project Settings → API → service_role (secret)
const supabase_service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY ;

export const supabase = createClient(
  supabase_endpoint,
  supabase_service_role_key,
  { auth: { persistSession: false } }  // recommended for server-side clients
)
if(!supabase) throw new Error("supabase integration failed");

//  call supabase create function only when needed ,
 export const createBucket = async ()=>{
    try{
const supaBucket = await supabase.storage.createBucket('socioverse-videostreaming',{
    public:true
});

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
            .from('socioVerse_videoStreaming')
            .upload(fileName, fileData, {
                cacheControl: '3600',
                upsert: false
            });
 if(data) return data;
        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        return data;
        
    } catch (err) {
        console.log('Some error occurred in uploading data to cloud');
        console.log('Cloud error:', err);
        return null;
    }
};
 