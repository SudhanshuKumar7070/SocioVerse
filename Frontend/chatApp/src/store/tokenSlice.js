import { createSlice } from "@reduxjs/toolkit";

const initialTokenState = {
  refreshToken:null,
//   accessToken:null
}

export const tokenSlice = createSlice({
  name:"token",
  initialState:initialTokenState,
  reducers:{
    setTokens: (state,action)=>{
      state.refreshToken=action.payload.refreshToken;
    //   state.accessToken=action.payload.accessToken;
    },
   removeTokens:(state)=>{
     state.refreshToken=null;
    //   state.accessToken=null;
    }
  }
})
export const {setTokens,removeTokens} = tokenSlice.actions;
export default tokenSlice.reducer;