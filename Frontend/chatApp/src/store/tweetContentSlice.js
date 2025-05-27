import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    textContent:""
}
 
export const tweetTextContentSlice = createSlice({
    name:"tweetTextContent",
    initialState,
    reducers:{
        setTweetText:(state,action)=>{
          state.textContent=action.payload.textContent
        }
    }

})
export const {setTweetText} = tweetTextContentSlice.actions

export default tweetTextContentSlice.reducer