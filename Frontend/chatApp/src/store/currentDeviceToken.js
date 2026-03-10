import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentDeviceToken:null
}

export const currentDeviceTokenSlice = createSlice({
    name:"currentDeviceToken",
    initialState,
    reducers:{
        setCurrentDeviceToken:(state,action)=>{
            state.currentDeviceToken=action.payload.currentDeviceToken;
        }
    }
})

export const {setCurrentDeviceToken} = currentDeviceTokenSlice.actions;
export default currentDeviceTokenSlice.reducer;