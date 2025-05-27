
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     userUrl:""
}

export const userUrlSlice = createSlice({
    name:"userUrl",
     initialState,
     reducers:{
        setUrl:(state,action)=>{
            state.userUrl=action.payload.userUrl;
        },
        
     }

})

export const {setUrl} = userUrlSlice.actions

export default userUrlSlice.reducer