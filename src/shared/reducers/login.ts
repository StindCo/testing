import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const loginSlice: Slice = createSlice({
  name: "user",
  initialState: {
    user: null
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload?.user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = loginSlice;

export const { loginUser } = actions;

export const getUser = (state: any) => state.user;

export default reducer;
